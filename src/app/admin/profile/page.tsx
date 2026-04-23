"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Lock, Save, Loader2, ShieldCheck, Mail, Shield } from "lucide-react";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "ADMIN",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/admin/profile");
        const data = await res.json();
        if (res.ok) {
          setFormData(prev => ({
            ...prev,
            name: data.name || "",
            email: data.email || "",
            role: data.role || "ADMIN"
          }));
        }
      } catch (err) {
        console.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Password konfirmasi tidak cocok." });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password || undefined,
        }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        // Update local session
        await update({
          ...session,
          user: {
            ...session?.user,
            name: updatedUser.name,
            email: updatedUser.email,
          },
        });
        setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
        setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Gagal memperbarui profil." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your Identity</h1>
        <p className={styles.subtitle}>Manage your personal credentials and presence within the dashboard.</p>
      </header>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {(formData.name || formData.email || "A").charAt(0).toUpperCase()}
          </div>
          <div className={styles.userEmail}>{formData.email}</div>
          <div className={styles.roleBadge}>
            <ShieldCheck size={14} className="inline mr-2" />
            {formData.role}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <div className={styles.inputWrapper}>
                <User size={20} className={styles.inputIcon} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={styles.input}
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail size={20} className={styles.inputIcon} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={styles.input}
                  placeholder="admin@nola.com"
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>System Role</label>
            <div className={styles.inputWrapper}>
              <Shield size={20} className={styles.inputIcon} />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={styles.select}
              >
                <option value="ADMIN">Admin</option>
                <option value="SUPERADMIN">Super Admin</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>New Password (Optional)</label>
            <div className={styles.inputWrapper}>
              <Lock size={20} className={styles.inputIcon} />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={styles.input}
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>

          {formData.password && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Confirm New Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={20} className={styles.inputIcon} />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={styles.input}
                  placeholder="Repeat your new password"
                  required
                />
              </div>
            </div>
          )}

          {message.text && (
            <div 
              style={{ 
                padding: '16px', 
                borderRadius: '16px', 
                backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: message.type === 'success' ? '#4ADE80' : '#F87171',
                fontSize: '0.875rem',
                fontWeight: 600,
                textAlign: 'center',
                border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
              }}
            >
              {message.text}
            </div>
          )}

          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>Updating Profile...</span>
              </>
            ) : (
              <>
                <Save size={24} />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

