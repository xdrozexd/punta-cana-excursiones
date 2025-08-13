import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// GET /api/blog-posts - Obtener todos los posts del blog
router.get('/', async (req, res) => {
  try {
    const { published, search, limit = 50, offset = 0 } = req.query;

    const where = {};

    if (published !== undefined) {
      where.published = published === 'true';
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    // Devolver solo el array para compatibilidad con el frontend actual
    res.json(posts);
  } catch (error) {
    console.error('Error al obtener posts del blog:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

// GET /api/blog-posts/:id - Obtener un post específico por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await prisma.blogPost.findUnique({
      where: { id }
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error al obtener post del blog:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// GET /api/blog-posts/slug/:slug - Obtener un post por slug (para el frontend público)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    
    // Solo devolver posts publicados para el frontend público
    if (!post.published) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error al obtener post del blog por slug:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// POST /api/blog-posts - Crear un nuevo post
router.post('/', async (req, res) => {
  try {
    console.log('POST /blog-posts - Body recibido:', JSON.stringify(req.body, null, 2));
    const {
      title,
      slug,
      content,
      excerpt,
      imageUrl,
      published = false,
      authorId = 'admin'
    } = req.body;
    
    // Validaciones básicas
    if (!title || !slug || !content || !excerpt || !imageUrl) {
      console.warn('POST /blog-posts - Faltan campos requeridos');
      return res.status(400).json({ 
        error: 'Campos requeridos: title, slug, content, excerpt, imageUrl' 
      });
    }
    
    // Verificar que el slug sea único
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    });
    
    if (existingPost) {
      return res.status(400).json({ 
        error: 'Ya existe un post con este slug. Por favor, usa un slug diferente.' 
      });
    }
    
    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        imageUrl,
        published,
        authorId
      }
    });
    
    console.log('POST /blog-posts - Creado post con id:', newPost.id);
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error al crear post del blog:', error);
    
    // Manejar error de slug duplicado
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return res.status(400).json({ 
        error: 'Ya existe un post con este slug. Por favor, usa un slug diferente.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// PUT /api/blog-posts/:id - Actualizar un post existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`PUT /blog-posts/${id} - Body recibido:`, JSON.stringify(req.body, null, 2));
    const {
      title,
      slug,
      content,
      excerpt,
      imageUrl,
      published,
      authorId
    } = req.body;
    
    // Verificar que el post existe
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });
    
    if (!existingPost) {
      console.warn(`PUT /blog-posts/${id} - Post no encontrado`);
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    
    // Si se está cambiando el slug, verificar que sea único
    if (slug && slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug }
      });
      
      if (slugExists) {
        return res.status(400).json({ 
          error: 'Ya existe un post con este slug. Por favor, usa un slug diferente.' 
        });
      }
    }
    
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(content && { content }),
        ...(excerpt && { excerpt }),
        ...(imageUrl && { imageUrl }),
        ...(published !== undefined && { published }),
        ...(authorId && { authorId })
      }
    });
    
    console.log(`PUT /blog-posts/${id} - Actualizado correctamente`);
    res.json(updatedPost);
  } catch (error) {
    console.error('Error al actualizar post del blog:', error);
    
    // Manejar error de slug duplicado
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return res.status(400).json({ 
        error: 'Ya existe un post con este slug. Por favor, usa un slug diferente.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// DELETE /api/blog-posts/:id - Eliminar un post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el post existe
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });
    
    if (!existingPost) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    
    await prisma.blogPost.delete({
      where: { id }
    });
    
    res.json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar post del blog:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// PATCH /api/blog-posts/:id/toggle-published - Cambiar estado de publicación
router.patch('/:id/toggle-published', async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });
    
    if (!existingPost) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        published: !existingPost.published
      }
    });
    
    res.json(updatedPost);
  } catch (error) {
    console.error('Error al cambiar estado de publicación:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// GET /api/blog-posts/public/published - Obtener posts publicados para el frontend público
router.get('/public/published', async (req, res) => {
  try {
    const { limit = 10, offset = 0, search } = req.query;
    
    const where = { published: true };
    
    // Búsqueda por título o excerpt
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    const posts = await prisma.blogPost.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        imageUrl: true,
        authorId: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });
    
    const total = await prisma.blogPost.count({ where });
    
    res.json({
      posts,
      total,
      hasMore: parseInt(offset) + posts.length < total
    });
  } catch (error) {
    console.error('Error al obtener posts publicados:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

export default router;
