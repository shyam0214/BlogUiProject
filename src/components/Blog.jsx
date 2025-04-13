import React, { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import {
  Container, Paper, TextField, Button, Typography, Box, Grid, Card,
  CardContent, CardActions, CardMedia, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Fab
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from './UserProfile';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const API_URL = process.env.REACT_APP_API_URL;
  
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBlogs(response.data);
    } catch (error) {
      toast.error('Error fetching blogs: ' + (error.response?.data?.message || error.message));
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearForm = () => {
    setFormData({ title: '', description: '', image: null });
    setImagePreview(null);
    setSelectedBlog(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        toast.error('Title and description are required');
        return;
      }

      if (!selectedBlog && !formData.image) {
        toast.error('Please upload an image');
        return;
      }

      const formDataWithImage = new FormData();
      formDataWithImage.append('title', formData.title);
      formDataWithImage.append('description', formData.description);
      if (formData.image) {
        formDataWithImage.append('image', formData.image);
      }

      if (selectedBlog) {
        await axios.put(`${API_URL}/blogs/${selectedBlog._id}`, formDataWithImage, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Blog updated successfully!');
      } else {
        await axios.post('http://localhost:3000/blogs', formDataWithImage, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Blog created successfully!');
      }
      
      setOpenDialog(false);
      clearForm();
      fetchBlogs();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'An error occurred');
    }
  };



  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      image: null
    });
    // Set the image preview using the full URL
    setImagePreview(`${process.env.REACT_APP_API_URL}/${blog.imageUrl}`);
    setOpenDialog(true);
  };

  const handleView = (blog) => {
    setSelectedBlog(blog);
    setOpenViewDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/blogs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Blog deleted successfully!');
      fetchBlogs();
    } catch (error) {
      toast.error('Error deleting blog: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Box sx={{ mb: 4, position: '' }}>
  <UserProfile />
</Box>

<ToastContainer />

<Paper 
  elevation={0}
  sx={{ 
    p: 3,
    mb: 2, 
    background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
    color: 'white',
    borderRadius: 2,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
    maxWidth: '85%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  }}
>
  <Box sx={{ position: 'relative', zIndex: 2 }}>
    <Typography variant="h5" gutterBottom fontWeight="600">
      Welcome to Your Blog Space
    </Typography>
    <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
      Share your thoughts, experiences, and stories with the world
    </Typography>
    <Button 
      variant="contained" 
      size="small"
      onClick={() => {
        clearForm();
        setOpenDialog(true);
      }}
      sx={{ 
        bgcolor: 'white', 
        color: 'primary.main',
        py: 0.5,
        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
      }}
    >
      Create New Blog
    </Button>
  </Box>
  
</Paper>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Latest Posts
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Explore the most recent stories from our community
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Card 
              sx={{ 
                height: '400px',  // Fixed card height
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box sx={{ 
                position: 'relative',
                height: '220px',  // Fixed image container height
                overflow: 'hidden'  // Ensure image doesn't overflow
              }}>
                <CardMedia
                  component="img"
                  height="220"  // Match container height
                  image={`${process.env.REACT_APP_API_URL}/${blog.imageUrl}`}
                  alt={blog.title}
                  sx={{ 
                    objectFit: 'cover',
                    width: '100%',
                    cursor: 'pointer',
                    filter: 'brightness(0.9)',
                    transition: 'filter 0.3s',
                    '&:hover': {
                      filter: 'brightness(1)'
                    }
                  }}
                  onClick={() => handleView(blog)}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    p: 0.5
                  }}
                >
                  <Typography variant="caption" sx={{ px: 1 }}>
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  gap: 2 
                }}>
                  <Avatar
                    src={`${API_URL}${blog.author?.profileImage}`}
                    alt={blog.author?.username}
                    sx={{ 
                      width: 45, 
                      height: 45,
                      border: '2px solid #fff',
                      boxShadow: 2
                    }}
                  />
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        lineHeight: 1.2
                      }}
                    >
                      {blog.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: '0.85rem' }}
                    >
                      {blog.author?.username}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions 
                sx={{ 
                  justifyContent: 'flex-end', 
                  p: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.02)',
                  borderTop: '1px solid rgba(0, 0, 0, 0.05)'
                }}
              >
                <IconButton 
                  onClick={() => handleView(blog)} 
                  color="primary"
                  sx={{ 
                    '&:hover': { 
                      bgcolor: 'primary.light',
                      color: 'white'
                    }
                  }}
                >
                  <ViewIcon />
                </IconButton>
                <IconButton 
                  onClick={() => handleEdit(blog)} 
                  color="secondary"
                  sx={{ 
                    '&:hover': { 
                      bgcolor: 'secondary.light',
                      color: 'white'
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => handleDelete(blog._id)} 
                  color="error"
                  sx={{ 
                    '&:hover': { 
                      bgcolor: 'error.light',
                      color: 'white'
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>


<Dialog 
  open={openViewDialog} 
  onClose={() => {
    setOpenViewDialog(false);
    setSelectedBlog(null);
  }}
  maxWidth="md" 
  fullWidth
  PaperProps={{
    sx: { borderRadius: 2 }
  }}
>
  {selectedBlog && (
    <>
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <Box sx={{ position: 'relative' }}>
          <img 
            src={`${API_URL}/${selectedBlog.imageUrl}`}
            alt={selectedBlog.title}
            style={{ 
              width: '100%', 
              height: '300px',
              objectFit: 'cover'
            }}
          />
        </Box>
        
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
            <Avatar
              src={`${API_URL}${selectedBlog.author?.profileImage}`}
              alt={selectedBlog.author?.username}
              sx={{ width: 50, height: 50 }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight="600">
                {selectedBlog.author?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(selectedBlog.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h5" gutterBottom fontWeight="600">
            {selectedBlog.title}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {selectedBlog.description}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button 
          onClick={() => setOpenViewDialog(false)}
          variant="outlined"
        >
          Close
        </Button>
      </DialogActions>
    </>
  )}
</Dialog>

      {/* Add or Edit Blog Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{selectedBlog ? 'Edit Blog' : 'Create New Blog'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            // In the Dialog form section
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={8}  // Increased from 4 to 8 rows
              value={formData.description}
              onChange={(e) => {
                const text = e.target.value;
                if (text.length <= 500) {
                  setFormData({ ...formData, description: text });
                }
              }}
              helperText={`${formData.description.length}/500 characters`}
              error={formData.description.length > 500}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  minHeight: '200px'  // Added minimum height
                }
              }}
            />
            <Button
              variant="contained"
              component="label"
              sx={{ mt: 2 }}
            >
              Upload Image
              <input 
                type="file" 
                hidden 
                onChange={handleImageChange}
              />
            </Button>
            {imagePreview && (
  <Box sx={{ mt: 2, textAlign: 'center' }}>
    <img 
      src={imagePreview} 
      alt="preview" 
      style={{ 
        width: '100%', 
        height: '200px', 
        objectFit: 'cover',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
      }} 
    />
  </Box>
)}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            type="submit" 
            form="blogForm" 
            variant="contained" 
            color="primary"
            onClick={handleSubmit}
          >
            {selectedBlog ? 'Update Blog' : 'Create Blog'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Blog;
