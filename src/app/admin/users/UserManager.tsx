"use client";

import { useState } from "react";
import {
  UserCog,
  Plus,
  Trash2,
  KeyRound,
  X,
  Loader2,
  Shield,
  ShieldCheck,
} from "lucide-react";
import styles from "./users.module.css";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface UserManagerProps {
  initialUsers: User[];
}

export default function UserManager({ initialUsers }: UserManagerProps) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
  });

  const openAddModal = () => {
    setEditUser(null);
    setForm({ name: "", email: "", password: "", role: "ADMIN" });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditUser(user);
    setForm({
      name: user.name || "",
      email: user.email,
      password: "",
      role: user.role,
    });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditUser(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoadingId("form");

    try {
      let res: Response;
      if (editUser) {
        // Update existing user
        const body: Record<string, string> = {
          name: form.name,
          role: form.role,
        };
        if (form.password) body.password = form.password;
        res = await fetch(`/api/admin/users/${editUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        // Create new user
        res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Terjadi kesalahan");
        return;
      }

      const updated = await res.json();
      if (editUser) {
        setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
      } else {
        setUsers([...users, updated]);
      }
      closeModal();
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus user ini? Tindakan ini tidak dapat dibatalkan."))
      return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
        router.refresh();
      }
    } catch {
      alert("Gagal menghapus user.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <div className={styles.grid}>
        {users.length === 0 ? (
          <div className={styles.emptyState}>
            <UserCog size={56} className={styles.emptyIcon} />
            <p>Belum ada user terdaftar.</p>
          </div>
        ) : (
          users.map((user: any) => (
            <div key={user.id} className={styles.userCard}>
              <div className={styles.cardTop}>
                <div className={styles.avatar}>
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{user.name || "—"}</div>
                  <div className={styles.userEmail}>{user.email}</div>
                  <span
                    className={`${styles.roleBadge} ${user.role === "SUPERADMIN" ? styles.roleSuperAdmin : styles.roleAdmin}`}
                  >
                    {user.role === "SUPERADMIN" ? (
                      <>
                        <ShieldCheck size={12} /> Super Admin
                      </>
                    ) : (
                      <>
                        <Shield size={12} /> Admin
                      </>
                    )}
                  </span>
                </div>
              </div>
              <div className={styles.cardActions}>
                <button
                  onClick={() => openEditModal(user)}
                  className={styles.actionBtn}
                  disabled={loadingId === user.id}
                >
                  <KeyRound size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  disabled={loadingId === user.id}
                >
                  {loadingId === user.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={14} /> Hapus
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add button floating */}
      <button onClick={openAddModal} className={styles.addBtn}>
        <Plus size={18} /> Tambah Admin User
      </button>

      {/* Modal */}
      {showModal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={closeModal}>
              <X size={16} />
            </button>
            <h2 className={styles.modalTitle}>
              {editUser ? "Edit User" : "Tambah Admin Baru"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nama Lengkap</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={styles.formInput}
                  placeholder="Nola Admin"
                />
              </div>
              {!editUser && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={styles.formInput}
                    placeholder="admin@nola.com"
                    required
                  />
                </div>
              )}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  {editUser
                    ? "Password Baru (kosongkan jika tidak diubah)"
                    : "Password"}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className={styles.formInput}
                  placeholder="••••••••"
                  required={!editUser}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={styles.formSelect}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SUPERADMIN">Super Admin</option>
                </select>
              </div>
              {error && <p className={styles.errorMsg}>{error}</p>}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={closeModal}
                  className={styles.cancelBtn}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loadingId === "form"}
                >
                  {loadingId === "form" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />{" "}
                      Menyimpan...
                    </>
                  ) : (
                    <>{editUser ? "Simpan Perubahan" : "Buat User"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
