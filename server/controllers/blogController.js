const prisma = require('../config/db');

async function getBlogs(req, res, next) {
  try {
    const { status } = req.query;
    const blogs = await prisma.blog.findMany({
      where: {
        ...(status && { status })
      },
      orderBy: { sortOrder: 'asc' }
    });
    return res.json({ success: true, data: blogs });
  } catch (err) {
    next(err);
  }
}

async function getBlogBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const blog = await prisma.blog.findFirst({
      where: {
        OR: [{ slug }, { id: slug }]
      }
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    return res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
}

async function createBlog(req, res, next) {
  try {
    const { category, title, author, date, readTime, status, summary, content, coverImage, tags, sortOrder } = req.body;

    if (!title || !category || !summary || !content) {
      return res.status(400).json({ success: false, message: 'Title, category, summary, and content are required' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const blog = await prisma.blog.create({
      data: {
        slug,
        category,
        title,
        author: author || 'Dr. Narayana Murthy, MD',
        date: date || 'Recently Published',
        readTime: readTime || '4 min read',
        status: status || 'published',
        summary,
        content,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=85',
        tags: tags || ['Healthcare', 'Diabetology'],
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0
      }
    });

    return res.status(201).json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
}

async function updateBlog(req, res, next) {
  try {
    const { id } = req.params;
    const allowed = ['slug', 'title', 'category', 'author', 'readTime', 'coverImage', 'summary', 'content', 'tags', 'status', 'publishedAt', 'sortOrder'];
    const updateData = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }
    if (updateData.sortOrder !== undefined) {
      updateData.sortOrder = parseInt(updateData.sortOrder, 10) || 0;
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: updateData
    });

    return res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
}

async function deleteBlog(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.blog.delete({ where: { id } });
    return res.json({ success: true, message: 'Blog deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
};
