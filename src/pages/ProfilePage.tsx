import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Edit, Star, User, Video, Film, History, Settings, Eye, EyeOff, Trash2, Upload, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUpdateProfile, useUploadAvatar, useUploadCover } from '@/hooks/api/useProfileApi';
import Layout from '@/components/Layout';

const TABS = [
  { key: 'posts', label: 'Posts', icon: User },
  { key: 'videos', label: 'Videos', icon: Video },
  { key: 'reels', label: 'Reels', icon: Film },
  { key: 'history', label: 'History', icon: History },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const ProfilePage = () => {
  const { profile, logout } = useAuth();
  const { mutate: updateProfile } = useUpdateProfile();
  const { mutate: uploadAvatar } = useUploadAvatar();
  const { mutate: uploadCover } = useUploadCover();
  
  const [activeTab, setActiveTab] = useState('posts');
  const [showEdit, setShowEdit] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: profile?.profile.displayName || '',
    username: profile?.user.username || '',
    email: profile?.user.email || '',
    bio: profile?.profile.bio || '',
    website: profile?.profile?.website || '',
    avatar: profile?.profile.avatar || '',
    coverImage: profile?.profile.coverImage || '',
  });
  const [previewImages, setPreviewImages] = useState({
    cover: null,
    avatar: null,
  });
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const [creatorForm, setCreatorForm] = useState({
    reason: '',
    category: '',
    portfolio: '',
  });
  const [settings, setSettings] = useState({
    private: false,
    showActivity: true,
    emailNotif: profile?.profile.preferences.notifications.email || true,
    pushNotif: profile?.profile.preferences.notifications.push || false,
  });

  // Handlers for forms
  const handleEditChange = e => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleCreatorChange = e => setCreatorForm({ ...creatorForm, [e.target.name]: e.target.value });
  const handleSettingsChange = key => setSettings(s => ({ ...s, [key]: !s[key] }));

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => ({
          ...prev,
          [type]: reader.result
        }));
      };
      reader.readAsDataURL(file);
      
      // Upload image to server
      if (type === 'avatar') {
        uploadAvatar(file);
      } else {
        uploadCover(file);
      }
    }
  };

  const handleSaveProfile = () => {
    updateProfile({
      displayName: editForm.displayName,
      bio: editForm.bio,
      preferences: {
        notifications: {
          email: settings.emailNotif,
          push: settings.pushNotif
        }
      }
    });
    setShowEdit(false);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="flex flex-col items-center bg-background px-2 sm:px-0">
        {/* Profile Header */}
        <div className="w-full max-w-3xl relative mb-8">
          {/* Cover Image */}
          <div className="h-32 sm:h-48 md:h-56 w-full rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-xl">
            <img src={profile.profile.coverImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80'} alt="cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
          {/* Profile Image */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-14 sm:-bottom-12 z-10">
            <img
              src={profile.profile.avatar || `https://ui-avatars.com/api/?name=${profile.profile.displayName}&background=6c47ff&color=fff&size=256`}
              alt={profile.user.username}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-background shadow-2xl object-cover bg-background"
              style={{ boxShadow: '0 8px 32px 0 rgba(108,71,255,0.25)' }}
            />
          </div>
        </div>
        {/* User Info & Actions */}
        <div className="w-full max-w-3xl flex flex-col items-center mt-20 sm:mt-16 mb-6">
          <div className="text-xl sm:text-2xl font-bold text-white mb-1">{profile.user.username}</div>
          <div className="text-base sm:text-lg text-reel-purple-200 mb-1">{profile.profile.displayName}</div>
          <div className="text-xs sm:text-sm text-muted-foreground mb-4 text-center px-2">{profile.profile.bio}</div>
          <div className="flex gap-6 sm:gap-8 mb-6">
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-bold text-white">{profile.stats.posts}</span>
              <span className="text-xs text-muted-foreground">Posts</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-bold text-white">{profile.stats.followers}</span>
              <span className="text-xs text-muted-foreground">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-bold text-white">{profile.stats.following}</span>
              <span className="text-xs text-muted-foreground">Following</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2 w-full max-w-xs">
            <Button variant="secondary" className="flex items-center gap-2 px-6 py-2 rounded-full w-full" onClick={() => setShowEdit(true)}>
              <Edit className="h-4 w-4" /> Edit Profile
            </Button>
            <Button variant="outline" className="flex items-center gap-2 px-6 py-2 rounded-full w-full" onClick={logout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
            {profile.user.role !== 'CREATOR' && (
              <Button className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-reel-purple-600 to-blue-500 text-white shadow-lg animate-pulse w-full" onClick={() => setShowCreator(true)}>
                <Star className="h-4 w-4" /> Become Creator
              </Button>
            )}
          </div>
        </div>
        {/* Tabs */}
        <div className="w-full max-w-3xl flex justify-center mb-8 overflow-x-auto scrollbar-thin scrollbar-thumb-reel-purple-700 scrollbar-track-transparent">
          <div className="flex gap-2 bg-black/30 backdrop-blur-lg rounded-full px-2 sm:px-4 py-2 shadow-lg min-w-[340px] sm:min-w-0">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-medium transition-all duration-200 text-xs sm:text-sm
                  ${activeTab === tab.key ? 'bg-reel-purple-600 text-white shadow-lg scale-105' : 'text-reel-purple-200 hover:bg-reel-purple-900/30'}`}
              >
                <tab.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Tab Content */}
        <div className="w-full max-w-3xl min-h-[200px] sm:min-h-[300px] bg-background/80 rounded-2xl shadow-xl p-4 sm:p-8 mb-16">
          {activeTab === 'posts' && (
            <div className="text-center text-base sm:text-lg text-muted-foreground">No posts yet. Start sharing your moments!</div>
          )}
          {activeTab === 'videos' && (
            <div className="text-center text-base sm:text-lg text-muted-foreground">No videos uploaded yet.</div>
          )}
          {activeTab === 'reels' && (
            <div className="text-center text-base sm:text-lg text-muted-foreground">No reels yet.</div>
          )}
          {activeTab === 'history' && (
            <div className="text-center text-base sm:text-lg text-muted-foreground">No history to show.</div>
          )}
          {activeTab === 'settings' && (
            <div className="flex flex-col items-center w-full">
              <div className="w-full max-w-md space-y-8">
                {/* Account Section */}
                <div className="mb-6">
                  <div className="text-lg sm:text-xl font-bold mb-2 text-foreground">Account</div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                      <span className="w-24 sm:w-32 text-muted-foreground">Name</span>
                      <span className="text-foreground">{profile.profile.displayName}</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="w-24 sm:w-32 text-muted-foreground">Username</span>
                      <span className="text-foreground">{profile.user.username}</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="w-24 sm:w-32 text-muted-foreground">Email</span>
                      <span className="text-foreground">{profile.user.email}</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="w-24 sm:w-32 text-muted-foreground">Password</span>
                      <Button variant="outline" size="sm" className="gap-2">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} Change
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Profile Section */}
                <div className="mb-6">
                  <div className="text-lg sm:text-xl font-bold mb-2 text-foreground">Profile</div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                      <span className="w-24 sm:w-32 text-muted-foreground">Bio</span>
                      <span className="text-foreground">{profile.profile.bio}</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="w-24 sm:w-32 text-muted-foreground">Website</span>
                      <span className="text-foreground break-all">{profile.profile.website}</span>
                    </div>
                  </div>
                </div>
                {/* Privacy Section */}
                <div className="mb-6">
                  <div className="text-lg sm:text-xl font-bold mb-2 text-foreground">Privacy</div>
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={settings.private} onChange={() => handleSettingsChange('private')} className="accent-reel-purple-500" />
                      <span>Make account private</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={settings.showActivity} onChange={() => handleSettingsChange('showActivity')} className="accent-reel-purple-500" />
                      <span>Show activity status</span>
                    </label>
                  </div>
                </div>
                {/* Notifications Section */}
                <div className="mb-6">
                  <div className="text-lg sm:text-xl font-bold mb-2 text-foreground">Notifications</div>
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={settings.emailNotif} onChange={() => handleSettingsChange('emailNotif')} className="accent-reel-purple-500" />
                      <span>Email notifications</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={settings.pushNotif} onChange={() => handleSettingsChange('pushNotif')} className="accent-reel-purple-500" />
                      <span>Push notifications</span>
                    </label>
                  </div>
                </div>
                {/* Danger Zone */}
                <div className="mb-2">
                  <div className="text-lg sm:text-xl font-bold mb-2 text-red-500">Danger Zone</div>
                  <Button variant="destructive" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" /> Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Profile Modal */}
        {showEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2">
            <div className="bg-background rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
              <button className="absolute top-4 right-4 text-xl" onClick={() => setShowEdit(false)}>&times;</button>
              <h2 className="text-lg sm:text-xl font-bold mb-4">Edit Profile</h2>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-reel-purple-500/20 shadow-lg">
                      <img 
                        src={previewImages.avatar || profile.profile.avatar || `https://ui-avatars.com/api/?name=${profile.profile.displayName}&background=6c47ff&color=fff&size=256`}
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <input
                            type="file"
                            ref={avatarInputRef}
                            onChange={(e) => handleImageUpload(e, 'avatar')}
                            accept="image/*"
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="bg-white/90 hover:bg-white text-black"
                            onClick={() => avatarInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" /> Change Photo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input name="displayName" value={editForm.displayName} onChange={handleEditChange} className="w-full rounded px-3 py-2 border border-border bg-background/80" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input name="username" value={editForm.username} disabled className="w-full rounded px-3 py-2 border border-border bg-background/80 opacity-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input name="email" value={editForm.email} disabled className="w-full rounded px-3 py-2 border border-border bg-background/80 opacity-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea name="bio" value={editForm.bio} onChange={handleEditChange} className="w-full rounded px-3 py-2 border border-border bg-background/80" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Website</label>
                    <input name="website" value={editForm.website} onChange={handleEditChange} className="w-full rounded px-3 py-2 border border-border bg-background/80" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowEdit(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-reel-purple-600 to-blue-500">Save Changes</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Become Creator Modal */}
        {showCreator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2">
            <div className="bg-background rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-md relative">
              <button className="absolute top-4 right-4 text-xl" onClick={() => setShowCreator(false)}>&times;</button>
              <h2 className="text-lg sm:text-xl font-bold mb-4">Become a Creator</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Why do you want to become a creator?</label>
                  <textarea name="reason" value={creatorForm.reason} onChange={handleCreatorChange} className="w-full rounded px-3 py-2 border border-border bg-background/80" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select name="category" value={creatorForm.category} onChange={handleCreatorChange} className="w-full rounded px-3 py-2 border border-border bg-background/80">
                    <option value="">Select category</option>
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Tech">Tech</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Portfolio/Links</label>
                  <input name="portfolio" value={creatorForm.portfolio} onChange={handleCreatorChange} className="w-full rounded px-3 py-2 border border-border bg-background/80" />
                </div>
                <Button className="w-full mt-4">Submit Application</Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
