import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ADMIN_TOKEN_KEY,
  createCommunityPost,
  deleteCommunityPost,
  getCommunityPosts,
  resolveApiUrl,
} from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem(ADMIN_TOKEN_KEY) || "";
    if (savedToken) {
      setAdminToken(savedToken);
    }

    const loadPosts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getCommunityPosts();
        setPosts(data);
      } catch (err) {
        setError(err.message || "Unable to load community posts.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !photo) {
      setError("Name, description and photo are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("photo", photo);

    try {
      setPosting(true);
      setError("");
      const created = await createCommunityPost(formData);
      setPosts((prev) => [created, ...prev]);
      setName("");
      setDescription("");
      setPhoto(null);
      const input = document.getElementById("dashboard-photo");
      if (input) input.value = "";
    } catch (err) {
      setError(err.message || "Failed to create post.");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!adminToken) {
      setAdminError("Admin login required to delete posts.");
      return;
    }

    try {
      setAdminError("");
      await deleteCommunityPost(postId, adminToken);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      const message = err.message || "Failed to delete post.";
      setAdminError(message);
      if (message.toLowerCase().includes("authentication")) {
        setAdminToken("");
        localStorage.removeItem(ADMIN_TOKEN_KEY);
      }
    }
  };

  return (
    <main className="community-page">
      <section className="community-wrap">
        <header className="community-header">
          <h1>Community Dashboard</h1>
          <p>People can share updates with name, description, and photo.</p>
        </header>

        <form className="community-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share your update"
            />
          </label>

          <label>
            Photo
            <input
              id="dashboard-photo"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
          </label>

          <button type="submit" disabled={posting}>
            {posting ? "Posting..." : "Post Update"}
          </button>
        </form>

        {error && <p className="community-error">{error}</p>}
        {adminError && <p className="community-error">{adminError}</p>}

        <div className="community-nav">
          <Link to="/aqi-map">Open live AQI map</Link>
          <Link to="/healthadvisor">Go to personalized Health Advisor</Link>
        </div>

        <section className="community-feed">
          <h2>Latest Posts</h2>
          {loading && <p>Loading posts...</p>}
          {!loading && posts.length === 0 && <p>No posts yet. Be the first one.</p>}

          <div className="community-grid">
            {posts.map((post) => (
              <article key={post.id} className="post-card">
                <img
                  src={resolveApiUrl(post.image_url)}
                  alt={`${post.name} post`}
                  loading="lazy"
                />
                <div className="post-body">
                  <h3>{post.name}</h3>
                  <p>{post.description}</p>
                  {adminToken && (
                    <button
                      type="button"
                      className="post-delete"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Dashboard;
