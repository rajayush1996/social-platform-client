/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Edit,
  Star,
  User,
  Video,
  Film,
  History,
  Settings,
  Eye,
  EyeOff,
  Trash2,
  Upload,
  X,
  UploadCloud,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  useUpdateProfile,
  useUploadAvatar,
  useUploadCover,
} from "@/hooks/api/useProfileApi";
import Layout from "@/components/Layout";
import { useUploadDocuments, useUploadProfile } from "@/hooks/useUploadProfile";
import { config } from "@/config/config";
import { useCreateCreatorRequest } from "@/hooks/useCreator";
import { useCreatorMediaList, useCreateMedia } from "@/hooks/useCreatorMedia";
import { useBunnyStreamUpload } from "@/hooks/useStreamUpload";
import { useCategories } from "@/hooks/useCategories";
import VideoCard from "@/components/videos/VideoCard";
import ReelCard from "@/components/reels/ReelCard";
import { toast } from "sonner";
import Loader from "@/components/Loader";

const TABS = [
  { key: "posts", label: "Posts", icon: User },
  { key: "videos", label: "Videos", icon: Video },
  { key: "reels", label: "Reels", icon: Film },
  { key: "history", label: "History", icon: History },
  { key: "settings", label: "Settings", icon: Settings },
];

const ProfilePage = () => {
  const { profile, logout } = useAuth();
  // const [file, setFile] = useState<File[]| null>(null);
  const [savedUrl, setSavedUrl] = useState<string[]>([]);
  const { mutate: updateProfile } = useUpdateProfile();
  const { mutate: uploadAvatar } = useUploadAvatar();
  const { mutate: uploadCover } = useUploadCover();

  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: profile?.profile.displayName || "",
    username: profile?.user.username || "",
    email: profile?.user.email || "",
    bio: profile?.profile.bio || "",
    website: profile?.profile?.website || "",
    avatar: profile?.profile.avatar || "",
    coverImage: profile?.profile.coverImage || "",
  });
  const [previewImages, setPreviewImages] = useState({
    cover: null,
    avatar: null,
  });
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const [creatorForm, setCreatorForm] = useState({
    name: "",
    photo: null as File | null,
    documents: [] as File[],
    idProof: null as File | null,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [settings, setSettings] = useState({
    private: false,
    showActivity: true,
    emailNotif: profile?.profile.preferences.notifications.email || true,
    pushNotif: profile?.profile.preferences.notifications.push || false,
  });

  const { data: videosData, isLoading: videosLoading } = useCreatorMediaList({
    type: "video",
  });
  const { data: reelsData, isLoading: reelsLoading } = useCreatorMediaList({
    type: "reel",
  });
  const { mutate: createMedia, isPending: creatingMedia } = useCreateMedia();
  const {
    uploadVideo: uploadStreamVideo,
    uploading: uploadingMedia,
    progress: streamProgress,
  } = useBunnyStreamUpload({
    libraryId: config.streamLibraryId,
    apiKey: config.streamApiKey,
  });
  const { data: categoriesData } = useCategories({ isActive: true, type: "videos", sortBy: "name" });
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState<"video" | "reel">("video");
  const [mediaForm, setMediaForm] = useState({
    title: "",
    description: "",
    tags: [],
    category: "",
    file: null as File | null,
  });

  // creator section ------------------------
  const { uploadDocuments, uploading } = useUploadDocuments({
    storageZoneName: config.storageZoneName,
    accessKey: config.accessKey,
    pullZoneUrl: config.pullZoneUrl,
  });

  const {
    submitRequest,
    isLoading: reqLoading,
    error: reqError,
  } = useCreateCreatorRequest();

  async function handleCreatorSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();

    if (
      !creatorForm.photo ||
      !creatorForm.idProof ||
      creatorForm.documents.length === 0
    )
      return;
    try {
      const [photoUrl] = await uploadDocuments([creatorForm.photo]);
      const docUrls = await uploadDocuments(creatorForm.documents);
      const [idUrl] = await uploadDocuments([creatorForm.idProof]);
      await submitRequest({
        name: creatorForm.name,
        photo: photoUrl,
        documents: docUrls,
        idProof: idUrl,
      });
      toast.success("Your creator request was submitted!");
      setCreatorForm({ name: "", photo: null, documents: [], idProof: null });
      setPhotoFile(null);
      setIdFile(null);
      setShowCreator(false);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || err.message || "Something went wrong.";
      toast.error(message);
    }
  }

  function handleDocumentsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    // setFile(newFiles); // preserve single‐file if you need it
    setCreatorForm((f) => ({
      ...f,
      documents: [...f.documents, ...newFiles],
    }));
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setCreatorForm((f) => ({ ...f, photo: file }));
  }

  function handleIdChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIdFile(file);
    setCreatorForm((f) => ({ ...f, idProof: file }));
  }

  function removeFile(idx: number) {
    setCreatorForm((f) => ({
      ...f,
      documents: f.documents.filter((_, i) => i !== idx),
    }));
  }

  function handleMediaChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setMediaForm((f) => ({ ...f, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setMediaForm((f) => ({ ...f, file }));
  }

  async function handleMediaSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mediaForm.file) return;
    try {
      const mediaFileId = await uploadStreamVideo(mediaForm.file);
      createMedia(
        {
          mediaFileId,
          title: mediaForm.title,
          description: mediaForm.description,
          tags: mediaForm.tags,
          category: mediaForm.category,
          mediaType: uploadType,
        },
        {
          onSuccess: () => {
            toast.success(
              `${uploadType === "video" ? "Video" : "Reel"} uploaded`
            );
            setMediaForm({
              title: "",
              description: "",
              tags: [],
              category: "",
              file: null,
            });
            setShowUpload(false);
          },
          onError: (err: any) => {
            const message =
              err.response?.data?.message || err.message || "Upload failed";
            toast.error(message);
          },
        }
      );
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Upload failed";
      toast.error(message);
    }
  }

  // after your state hooks:
  const isFormValid =
    creatorForm.name.trim() !== "" &&
    creatorForm.photo !== null &&
    creatorForm.idProof !== null &&
    creatorForm.documents.length > 0;

  // creator section ------------------------

  // Handlers for forms
  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleCreatorChange = (e) =>
    setCreatorForm({ ...creatorForm, [e.target.name]: e.target.value });
  const handleSettingsChange = (key) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => ({
          ...prev,
          [type]: reader.result,
        }));
      };
      reader.readAsDataURL(file);

      // Upload image to server
      if (type === "avatar") {
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
          push: settings.pushNotif,
        },
      },
    });
    setShowEdit(false);
  };

  if (!profile) {
    return (
      <Layout>
        <Loader fullScreen />
      </Layout>
    );
  }

  const handleTagKeyDown = (e) => {
    const value = e.target.value.trim();
    if ((e.key === "Enter" || e.key === ",") && value) {
      e.preventDefault();
      if (!mediaForm.tags.includes(value)) {
        setMediaForm((prev) => ({
          ...prev,
          tags: [...prev.tags, value],
        }));
      }
      e.target.value = "";
    }
  };

  const removeTag = (tagToRemove) => {
    setMediaForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <Layout>
      <div className="flex flex-col items-center bg-background px-2 sm:px-0">
        {/* Profile Header */}
        <div className="w-full max-w-3xl relative mb-8">
          {/* Cover Image */}
          <div className="h-32 sm:h-48 md:h-56 w-full rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-xl">
            <img
              src={
                profile.profile.coverImage ||
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
              }
              alt="cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
          {/* Profile Image */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-14 sm:-bottom-12 z-10">
            <img
              src={
                profile.profile.avatar ||
                `https://ui-avatars.com/api/?name=${profile.profile.displayName}&background=6c47ff&color=fff&size=256`
              }
              alt={profile.user.username}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-background shadow-2xl object-cover bg-background"
              style={{ boxShadow: "0 8px 32px 0 rgba(108,71,255,0.25)" }}
            />
          </div>
        </div>
        {/* User Info & Actions */}
        <div className="w-full max-w-3xl flex flex-col items-center mt-20 sm:mt-16 mb-6">
          <div className="text-xl sm:text-2xl font-bold text-white mb-1">
            {profile.user.username}
          </div>
          <div className="text-base sm:text-lg text-reel-purple-200 mb-1">
            {profile.profile.displayName}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground mb-4 text-center px-2">
            {profile.profile.bio}
          </div>
          <div className="flex gap-6 sm:gap-8 mb-6">
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-bold text-white">
                {profile.stats.posts}
              </span>
              <span className="text-xs text-muted-foreground">Posts</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-bold text-white">
                {profile.stats.followers}
              </span>
              <span className="text-xs text-muted-foreground">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg sm:text-xl font-bold text-white">
                {profile.stats.following}
              </span>
              <span className="text-xs text-muted-foreground">Following</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2 w-full max-w-xs">
            <Button
              variant="secondary"
              className="flex items-center gap-2 px-6 py-2 rounded-full w-full"
              onClick={() => setShowEdit(true)}
            >
              <Edit className="h-4 w-4" /> Edit Profile
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 px-6 py-2 rounded-full w-full"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
            {profile.user.role !== "CREATOR" && (
              <Button
                className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-reel-purple-600 to-blue-500 text-white shadow-lg animate-pulse w-full"
                onClick={() => setShowCreator(true)}
              >
                <Star className="h-4 w-4" /> Become Creator
              </Button>
            )}
          </div>
        </div>
        {/* Tabs */}
        <div className="w-full max-w-3xl flex justify-center mb-8 overflow-x-auto scrollbar-thin scrollbar-thumb-reel-purple-700 scrollbar-track-transparent">
          <div className="flex gap-2 bg-black/30 backdrop-blur-lg rounded-full px-2 sm:px-4 py-2 shadow-lg min-w-[340px] sm:min-w-0">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-medium transition-all duration-200 text-xs sm:text-sm
                  ${
                    activeTab === tab.key
                      ? "bg-reel-purple-600 text-white shadow-lg scale-105"
                      : "text-reel-purple-200 hover:bg-reel-purple-900/30"
                  }`}
              >
                <tab.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Tab Content */}
        <div className="w-full max-w-3xl min-h-[200px] sm:min-h-[300px] bg-background/80 rounded-2xl shadow-xl p-4 sm:p-8 mb-16">
          {activeTab === "posts" && (
            <div className="text-center text-base sm:text-lg text-muted-foreground">
              No posts yet. Start sharing your moments!
            </div>
          )}
          {activeTab === "videos" && (
            <>
              {profile.user.role === "CREATOR" && (
                <div className="flex justify-end mb-4">
                  <Button
                    size="icon"
                    onClick={() => {
                      setUploadType("video");
                      setShowUpload(true);
                    }}
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>
              )}
              {videosLoading ? (
                <div className="flex justify-center">
                  <Loader size={40} />
                </div>
              ) : videosData?.results && videosData.results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {videosData.results.map((v) => (
                    <VideoCard key={v.id || v._id} v={v} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-base sm:text-lg text-muted-foreground">
                  No videos uploaded yet.
                </div>
              )}
            </>
          )}
          {activeTab === "reels" && (
            <>
              {profile.user.role === "CREATOR" && (
                <div className="flex justify-end mb-4">
                  <Button
                    size="icon"
                    onClick={() => {
                      setUploadType("reel");
                      setShowUpload(true);
                    }}
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>
              )}
              {reelsLoading ? (
                <div className="flex justify-center">
                  <Loader size={40} />
                </div>
              ) : reelsData?.results && reelsData.results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {reelsData.results.map((r) => (
                    <ReelCard key={r.id || r._id} reel={r} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-base sm:text-lg text-muted-foreground">
                  No reels yet.
                </div>
              )}
            </>
          )}
          {activeTab === "history" && (
            <div className="text-center text-base sm:text-lg text-muted-foreground">
              No history to show.
            </div>
          )}
          {activeTab === "settings" && (
            <div className="flex flex-col items-center w-full">
              <div className="w-full max-w-md space-y-8">
                {/* Account Section */}
                <div className="mb-6">
                  <div className="text-lg sm:text-xl font-bold mb-2 text-foreground">
                    Account
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                      <span className="w-24 sm:w-32 text-muted-foreground">
                        Name
                      </span>
                      <span className="text-foreground">
                        {profile.profile.displayName}
                      </span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="w-24 sm:w-32 text-muted-foreground">
                        Username
                      </span>
                      <span className="text-foreground">
                        {profile.user.username}
                      </span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="w-24 sm:w-32 text-muted-foreground">
                        Email
                      </span>
                      <span className="text-foreground">
                        {profile.user.email}
                      </span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="w-24 sm:w-32 text-muted-foreground">
                        Password
                      </span>
                      <Button variant="outline" size="sm" className="gap-2">
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}{" "}
                        Change
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Profile Section */}
                <div className="mb-6">
                  <div className="text-lg sm:text-xl font-bold mb-2 text-foreground">
                    Profile
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                      <span className="w-24 sm:w-32 text-muted-foreground">
                        Bio
                      </span>
                      <span className="text-foreground">
                        {profile.profile.bio}
                      </span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="w-24 sm:w-32 text-muted-foreground">
                        Website
                      </span>
                      <span className="text-foreground break-all">
                        {profile.profile.website}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Privacy Section */}
                <div className="mb-6">
                  <div className="text-lg sm:text-xl font-bold mb-2 text-foreground">
                    Privacy
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.private}
                        onChange={() => handleSettingsChange("private")}
                        className="accent-reel-purple-500"
                      />
                      <span>Make account private</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showActivity}
                        onChange={() => handleSettingsChange("showActivity")}
                        className="accent-reel-purple-500"
                      />
                      <span>Show activity status</span>
                    </label>
                  </div>
                </div>
                {/* Notifications Section */}
                <div className="mb-6">
                  <div className="text-lg sm:text-xl font-bold mb-2 text-foreground">
                    Notifications
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotif}
                        onChange={() => handleSettingsChange("emailNotif")}
                        className="accent-reel-purple-500"
                      />
                      <span>Email notifications</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.pushNotif}
                        onChange={() => handleSettingsChange("pushNotif")}
                        className="accent-reel-purple-500"
                      />
                      <span>Push notifications</span>
                    </label>
                  </div>
                </div>
                {/* Danger Zone */}
                <div className="mb-2">
                  <div className="text-lg sm:text-xl font-bold mb-2 text-red-500">
                    Danger Zone
                  </div>
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
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
              <button
                className="absolute top-4 right-4 text-xl"
                onClick={() => setShowEdit(false)}
              >
                &times;
              </button>
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                Edit Profile
              </h2>
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveProfile();
                }}
              >
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-reel-purple-500/20 shadow-lg">
                      <img
                        src={
                          previewImages.avatar ||
                          profile.profile.avatar ||
                          `https://ui-avatars.com/api/?name=${profile.profile.displayName}&background=6c47ff&color=fff&size=256`
                        }
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <input
                            type="file"
                            ref={avatarInputRef}
                            onChange={(e) => handleImageUpload(e, "avatar")}
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
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      name="displayName"
                      value={editForm.displayName}
                      onChange={handleEditChange}
                      className="w-full rounded px-3 py-2 border border-border bg-background/80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Username
                    </label>
                    <input
                      name="username"
                      value={editForm.username}
                      disabled
                      className="w-full rounded px-3 py-2 border border-border bg-background/80 opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      name="email"
                      value={editForm.email}
                      disabled
                      className="w-full rounded px-3 py-2 border border-border bg-background/80 opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleEditChange}
                      className="w-full rounded px-3 py-2 border border-border bg-background/80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Website
                    </label>
                    <input
                      name="website"
                      value={editForm.website}
                      onChange={handleEditChange}
                      className="w-full rounded px-3 py-2 border border-border bg-background/80"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowEdit(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-reel-purple-600 to-blue-500"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Become Creator Modal */}
        {showCreator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2">
            <div className="bg-background rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-md relative">
              <button
                className="absolute top-4 right-4 text-xl"
                onClick={() => setShowCreator(false)}
              >
                &times;
              </button>
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                Become a Creator
              </h2>
              <form className="space-y-4" onSubmit={handleCreatorSubmit}>
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    name="name"
                    value={creatorForm.name}
                    onChange={handleCreatorChange}
                    placeholder="Full Name"
                    className="w-full rounded px-3 py-2 border border-border bg-background/80"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Photo Upload
                  </label>
                  <label
                    htmlFor="photo"
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-background/80 cursor-pointer hover:border-primary transition-colors"
                  >
                    <UploadCloud className="w-8 h-8 text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click or drag photo here
                    </span>
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  {photoFile && (
                    <p className="text-sm mt-1 truncate">{photoFile.name}</p>
                  )}
                </div>

                {/* Document Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Documents Upload
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Please upload clear documents with your face.
                  </p>
                  <label
                    htmlFor="documents"
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-background/80 cursor-pointer hover:border-primary transition-colors"
                  >
                    <UploadCloud className="w-8 h-8 text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click or drag files here
                    </span>
                    <input
                      id="documents"
                      type="file"
                      accept="image/*,application/pdf,.doc,.docx"
                      multiple
                      onChange={handleDocumentsChange}
                      className="hidden"
                    />
                  </label>

                  {creatorForm.documents.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {creatorForm.documents.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between bg-background/50 px-3 py-1 rounded"
                        >
                          <span className="truncate">{f.name}</span>
                          <X
                            className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
                            onClick={() => removeFile(i)}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* ID Proof */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    ID Proof
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Upload a clear ID proof where all details are readable.
                  </p>
                  <label
                    htmlFor="idProof"
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-background/80 cursor-pointer hover:border-primary transition-colors"
                  >
                    <UploadCloud className="w-8 h-8 text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Upload ID proof
                    </span>
                    <input
                      id="idProof"
                      type="file"
                      accept="image/*,application/pdf,.doc,.docx"
                      onChange={handleIdChange}
                      className="hidden"
                    />
                  </label>
                  {idFile && (
                    <p className="text-sm mt-1 truncate">{idFile.name}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid || uploading}
                  className="w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Application
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Upload Media Modal */}
        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2">
            <div className="bg-background rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-md relative">
              <button
                className="absolute top-4 right-4 text-xl"
                onClick={() => setShowUpload(false)}
              >
                &times;
              </button>
              <h2 className="text-lg font-bold mb-4">
                Upload {uploadType === "video" ? "Video" : "Reel"}
              </h2>
              <form onSubmit={handleMediaSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    name="title"
                    value={mediaForm.title}
                    onChange={handleMediaChange}
                    className="w-full rounded px-3 py-2 border border-border bg-background/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={mediaForm.description}
                    onChange={handleMediaChange}
                    className="w-full rounded px-3 py-2 border border-border bg-background/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <div className="w-full min-h-[44px] border border-border bg-background/80 rounded px-2 py-2 flex flex-wrap items-center gap-2">
                    {mediaForm.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-violet-600 text-white"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-white hover:text-gray-200"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      onKeyDown={handleTagKeyDown}
                      placeholder="Press Enter to add"
                      className="flex-1 min-w-[120px] bg-transparent focus:outline-none text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={mediaForm.category}
                    onChange={handleMediaChange}
                    className="w-full rounded px-3 py-2 border border-border bg-background/80"
                  >
                    <option value="">Select</option>
                    {categoriesData.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">File</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-400 
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-600 file:text-white
              hover:file:bg-violet-700
              dark:file:bg-violet-500 dark:hover:file:bg-violet-600"
                  />
                  {mediaForm.file && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>
                        <strong>Name:</strong> {mediaForm.file.name}
                      </p>
                      <p>
                        <strong>Type:</strong> {mediaForm.file.type}
                      </p>
                      <p>
                        <strong>Size:</strong>{" "}
                        {(mediaForm.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload Progress Bar */}
                {uploadingMedia && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div
                      className="bg-violet-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${streamProgress}%` }}
                    />
                    <p className="text-xs mt-1 text-center text-muted-foreground">
                      Uploading... {streamProgress.toFixed(0)}%
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowUpload(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={creatingMedia || uploadingMedia}
                  >
                    {creatingMedia || uploadingMedia
                      ? "Uploading..."
                      : "Upload"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
