#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');
const { z } = require('zod');

// Esquemas de validación
const GetProjectsSchema = z.object({});

const GetDeploymentsSchema = z.object({
  projectId: z.string().optional(),
  limit: z.number().optional().default(10)
});

const CreateDeploymentSchema = z.object({
  projectId: z.string(),
  target: z.enum(['production', 'preview']).optional().default('preview')
});

const GetProjectInfoSchema = z.object({
  projectId: z.string()
});

class VercelMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'vercel-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.vercelToken = process.env.VERCEL_TOKEN;
    if (!this.vercelToken) {
      console.error('VERCEL_TOKEN environment variable is required');
      process.exit(1);
    }

    this.apiBase = 'https://api.vercel.com';
    this.setupHandlers();
  }

  setupHandlers() {
    // Manejar lista de herramientas
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_projects',
            description: 'Obtener lista de proyectos en Vercel',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_deployments',
            description: 'Obtener lista de despliegues de un proyecto',
            inputSchema: {
              type: 'object',
              properties: {
                projectId: {
                  type: 'string',
                  description: 'ID del proyecto (opcional, si no se proporciona obtiene todos)',
                },
                limit: {
                  type: 'number',
                  description: 'Número máximo de despliegues a obtener (default: 10)',
                  default: 10,
                },
              },
            },
          },
          {
            name: 'get_project_info',
            description: 'Obtener información detallada de un proyecto específico',
            inputSchema: {
              type: 'object',
              properties: {
                projectId: {
                  type: 'string',
                  description: 'ID del proyecto',
                },
              },
              required: ['projectId'],
            },
          },
          {
            name: 'create_deployment',
            description: 'Crear un nuevo despliegue para un proyecto',
            inputSchema: {
              type: 'object',
              properties: {
                projectId: {
                  type: 'string',
                  description: 'ID del proyecto',
                },
                target: {
                  type: 'string',
                  enum: ['production', 'preview'],
                  description: 'Tipo de despliegue (production o preview)',
                  default: 'preview',
                },
              },
              required: ['projectId'],
            },
          },
        ],
      };
    });

    // Manejar llamadas a herramientas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_projects':
            return await this.getProjects();
          
          case 'get_deployments':
            const deploymentsArgs = GetDeploymentsSchema.parse(args);
            return await this.getDeployments(deploymentsArgs);
          
          case 'get_project_info':
            const projectArgs = GetProjectInfoSchema.parse(args);
            return await this.getProjectInfo(projectArgs.projectId);
          
          case 'create_deployment':
            const deploymentArgs = CreateDeploymentSchema.parse(args);
            return await this.createDeployment(deploymentArgs);
          
          default:
            throw new Error(`Herramienta desconocida: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async makeVercelRequest(endpoint, method = 'GET', data = null) {
    try {
      const response = await axios({
        method,
        url: `${this.apiBase}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.vercelToken}`,
          'Content-Type': 'application/json',
        },
        data,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
      }
      throw new Error(`Network Error: ${error.message}`);
    }
  }

  async getProjects() {
    const data = await this.makeVercelRequest('/v9/projects');
    
    const projectsList = data.projects.map(project => ({
      id: project.id,
      name: project.name,
      framework: project.framework,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      live: project.live,
      targets: project.targets
    }));

    return {
      content: [
        {
          type: 'text',
          text: `📚 **Proyectos en Vercel (${projectsList.length})**\n\n` +
                projectsList.map(p => 
                  `🔹 **${p.name}**\n` +
                  `   - ID: \`${p.id}\`\n` +
                  `   - Framework: ${p.framework || 'No especificado'}\n` +
                  `   - Estado: ${p.live ? '🟢 Live' : '🔴 Offline'}\n` +
                  `   - Creado: ${new Date(p.createdAt).toLocaleDateString()}\n`
                ).join('\n'),
        },
      ],
    };
  }

  async getDeployments({ projectId, limit }) {
    let endpoint = `/v6/deployments?limit=${limit}`;
    if (projectId) {
      endpoint += `&projectId=${projectId}`;
    }

    const data = await this.makeVercelRequest(endpoint);
    
    const deploymentsList = data.deployments.map(deployment => ({
      uid: deployment.uid,
      name: deployment.name,
      url: deployment.url,
      state: deployment.state,
      target: deployment.target,
      createdAt: deployment.createdAt,
      ready: deployment.ready
    }));

    return {
      content: [
        {
          type: 'text',
          text: `🚀 **Despliegues (${deploymentsList.length})**\n\n` +
                deploymentsList.map(d => 
                  `🔹 **${d.name || d.url}**\n` +
                  `   - UID: \`${d.uid}\`\n` +
                  `   - URL: https://${d.url}\n` +
                  `   - Estado: ${this.getStateEmoji(d.state)} ${d.state}\n` +
                  `   - Target: ${d.target || 'preview'}\n` +
                  `   - Listo: ${d.ready ? '✅' : '⏳'}\n` +
                  `   - Creado: ${new Date(d.createdAt).toLocaleString()}\n`
                ).join('\n'),
        },
      ],
    };
  }

  async getProjectInfo(projectId) {
    const data = await this.makeVercelRequest(`/v9/projects/${projectId}`);
    
    return {
      content: [
        {
          type: 'text',
          text: `📋 **Información del Proyecto: ${data.name}**\n\n` +
                `🆔 **ID:** \`${data.id}\`\n` +
                `🌐 **Framework:** ${data.framework || 'No especificado'}\n` +
                `📁 **Root Directory:** ${data.rootDirectory || '/'}\n` +
                `🔗 **Repository:** ${data.link?.repo || 'No conectado'}\n` +
                `🎯 **Production Domain:** ${data.targets?.production?.domain || 'No configurado'}\n` +
                `📅 **Creado:** ${new Date(data.createdAt).toLocaleString()}\n` +
                `🔄 **Actualizado:** ${new Date(data.updatedAt).toLocaleString()}\n` +
                `📊 **Estado:** ${data.live ? '🟢 Live' : '🔴 Offline'}\n\n` +
                `**Variables de Entorno:** ${data.env?.length || 0} configuradas\n` +
                `**Dominios:** ${data.alias?.length || 0} configurados`,
        },
      ],
    };
  }

  async createDeployment({ projectId, target }) {
    // Nota: Esta función requiere más configuración para un despliegue real
    // Por seguridad, solo simularemos la acción
    return {
      content: [
        {
          type: 'text',
          text: `⚠️ **Crear Despliegue**\n\n` +
                `Para crear un despliegue real, usa:\n\n` +
                `\`\`\`bash\n` +
                `vercel --prod # Para producción\n` +
                `vercel # Para preview\n` +
                `\`\`\`\n\n` +
                `O configura GitHub Actions para despliegues automáticos.\n\n` +
                `**Proyecto:** ${projectId}\n` +
                `**Target:** ${target}`,
        },
      ],
    };
  }

  getStateEmoji(state) {
    const stateMap = {
      'BUILDING': '🔨',
      'ERROR': '❌', 
      'INITIALIZING': '🚀',
      'QUEUED': '⏳',
      'READY': '✅',
      'CANCELED': '🚫'
    };
    return stateMap[state] || '❓';
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Vercel MCP Server running on stdio');
  }
}

// Iniciar el servidor
const server = new VercelMCPServer();
server.run().catch(console.error);
