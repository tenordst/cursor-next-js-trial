'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { AuthUser } from '@/types/auth';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  CircularProgress,
  IconButton,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Fingerprint as FingerprintIcon,
  AccessTime as AccessTimeIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

export default function DashboardPage() {
  const { user, userAttributes, signOut, updateProfile, loading: authLoading, error } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
    // Initialize form values when user data is available
    if (userAttributes) {
      setFirstName(userAttributes.given_name || '');
      setLastName(userAttributes.family_name || '');
    }
  }, [user, userAttributes, authLoading, router]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        given_name: firstName,
        family_name: lastName,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFirstName(userAttributes?.given_name || '');
    setLastName(userAttributes?.family_name || '');
    setIsEditing(false);
  };

  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main' }}>
            Dashboard
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">User Profile</Typography>
                {!isEditing && (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    color="primary"
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>

              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="action" />
                    {isEditing ? (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={isSaving}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={isSaving}
                          />
                        </Grid>
                      </Grid>
                    ) : (
                      <Typography>
                        Name: {userAttributes?.given_name || 'Not set'} {userAttributes?.family_name || ''}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon color="action" />
                    <Typography>Email: {userAttributes?.email || user.signInDetails?.loginId}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FingerprintIcon color="action" />
                    <Typography>User ID: {user.userId}</Typography>
                  </Box>
                </Grid>
              </Grid>

              {isEditing && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={isSaving ? <CircularProgress size={20} /> : <CheckIcon />}
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Recent Activity
              </Typography>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">
                    Last sign in: {new Date().toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Authentication method: {user.signInDetails?.authFlowType || 'Email and Password'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    disabled={isSigningOut}
                    startIcon={<PersonIcon />}
                  >
                    Update Profile
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    disabled={isSigningOut}
                    startIcon={<SecurityIcon />}
                  >
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 