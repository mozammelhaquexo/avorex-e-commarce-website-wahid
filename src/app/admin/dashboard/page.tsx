"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LogOut, Plus, Trash2, Edit3, ShoppingCart, 
  Package, Inbox, AlertCircle, TrendingUp, 
  X, ExternalLink, Settings, ShieldAlert, PhoneCall,
  MessageSquare, Save, RotateCcw, Globe, CreditCard,
  MapPin, Clock, Building2, Database, Download, Upload,
  HardDrive, RefreshCw, FileJson
} from "lucide-react";

// Procedural vector SVGs matching the database keys
const svgPiston = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40"><circle cx="50" cy="50" r="45" fill="%23FAF6EE" stroke="%23D4AF37" stroke-width="1.5"/><path d="M35 25 h30 v25 h-30 z" fill="%23C5A059" opacity="0.3"/><rect x="35" y="25" width="30" height="28" rx="2" fill="none" stroke="%238C6239" stroke-width="2"/><circle cx="50" cy="42" r="5" fill="%23FDFBF7" stroke="%238C6239" stroke-width="1.5"/><rect x="46" y="42" width="8" height="35" rx="1" fill="none" stroke="%238C6239" stroke-width="2"/></svg>`;
const svgCarburetor = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40"><circle cx="50" cy="50" r="45" fill="%23FAF6EE" stroke="%23D4AF37" stroke-width="1.5"/><path d="M30 40 h40 v25 h-40 z" fill="%23C5A059" opacity="0.3"/><rect x="30" y="38" width="40" height="25" rx="3" fill="none" stroke="%238C6239" stroke-width="2"/><circle cx="50" cy="50" r="8" fill="none" stroke="%23D4AF37" stroke-width="2"/></svg>`;
const svgSparkPlug = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40"><circle cx="50" cy="50" r="45" fill="%23FAF6EE" stroke="%23D4AF37" stroke-width="1.5"/><path d="M44 20 h12 v50 h-12 z" fill="%23C5A059" opacity="0.2"/><rect x="44" y="30" width="12" height="22" rx="2" fill="none" stroke="%238C6239" stroke-width="2"/><rect x="42" y="52" width="16" height="12" rx="1" fill="none" stroke="%23D4AF37" stroke-width="2"/></svg>`;
const svgValve = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40"><circle cx="50" cy="50" r="45" fill="%23FAF6EE" stroke="%23D4AF37" stroke-width="1.5"/><path d="M35 30 h30 v30 h-30 z" fill="%23C5A059" opacity="0.3"/><rect x="38" y="26" width="24" height="28" rx="2" fill="none" stroke="%238C6239" stroke-width="2"/></svg>`;
const svgFilter = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40"><circle cx="50" cy="50" r="45" fill="%23FAF6EE" stroke="%23D4AF37" stroke-width="1.5"/><path d="M35 30 h30 v40 h-30 z" fill="%23C5A059" opacity="0.3"/><rect x="35" y="28" width="30" height="44" rx="4" fill="none" stroke="%238C6239" stroke-width="2"/></svg>`;
const svgMixer = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40"><circle cx="50" cy="50" r="45" fill="%23FAF6EE" stroke="%23D4AF37" stroke-width="1.5"/><path d="M35 30 L65 30 L55 50 L65 70 L35 70 L45 50 Z" fill="%23C5A059" opacity="0.3"/><path d="M35 30 L65 30 L55 50 L65 70 L35 70 L45 50 Z" fill="none" stroke="%238C6239" stroke-width="2" stroke-linejoin="round"/></svg>`;

const getSvgIcon = (key: string) => {
  if (key === "carburetor") return svgCarburetor;
  if (key === "sparkplug") return svgSparkPlug;
  if (key === "piston") return svgPiston;
  if (key === "valve") return svgValve;
  if (key === "filter") return svgFilter;
  if (key === "mixer") return svgMixer;
  return key; // fallbacks to url strings
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // Data States
  const [products, setProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  // Modal / Form States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Product Form Input Fields
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [catEn, setCatEn] = useState("Carburetors");
  const [catBn, setCatBn] = useState("কার্বুরেটর");
  const [sku, setSku] = useState("");
  const [unit, setUnit] = useState("pcs");

  // Admin Search Query
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  // New Category Form Fields
  const [newCatBn, setNewCatBn] = useState("");
  const [newCatEn, setNewCatEn] = useState("");

  // New Unit Form Fields
  const [newUnitName, setNewUnitName] = useState("");

  // Dashboard Tab State
  const [activeTab, setActiveTab] = useState<"products" | "whatsapp" | "site-settings" | "backup" | "security">("products");

  // Security / Change Credentials State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityMsg, setSecurityMsg] = useState("");
  const [securityError, setSecurityError] = useState("");

  // WhatsApp Settings State
  const [whatsappSettings, setWhatsappSettings] = useState<Record<string, string>>({});
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [whatsappSaving, setWhatsappSaving] = useState(false);
  const [whatsappSaveMsg, setWhatsappSaveMsg] = useState("");

  // Site Settings State
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [siteSettingsLoading, setSiteSettingsLoading] = useState(false);
  const [siteSettingsSaving, setSiteSettingsSaving] = useState(false);
  const [siteSettingsSaveMsg, setSiteSettingsSaveMsg] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<string[]>(["bKash", "Nagad", "Rocket", "COD"]);
  const [newPaymentMethod, setNewPaymentMethod] = useState("");

  // Backup State
  const [backups, setBackups] = useState<any[]>([]);
  const [backupLoading, setBackupLoading] = useState(false);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoringBackup, setRestoringBackup] = useState(false);
  const [backupMsg, setBackupMsg] = useState("");
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [restoreMode, setRestoreMode] = useState<"full" | "merge">("full");

  // Google Drive State
  const [gdriveClientId, setGdriveClientId] = useState("");
  const [gdriveClientSecret, setGdriveClientSecret] = useState("");
  const [gdriveConnected, setGdriveConnected] = useState(false);
  const [gdriveLoading, setGdriveLoading] = useState(false);
  const [gdriveFiles, setGdriveFiles] = useState<any[]>([]);
  const [gdriveMsg, setGdriveMsg] = useState("");
  const [gdriveBacking, setGdriveBacking] = useState(false);

  // Validate authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
        
        // Fetch each independently — one failing won't block others
        fetchAllData().catch(() => {});
        fetchCategories().catch(() => {});
        fetchUnits().catch(() => {});
        fetchWhatsappSettings().catch(() => {});
        fetchSiteSettings().catch(() => {});
      } catch (err) {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchUnits = async () => {
    try {
      const res = await fetch("/api/units");
      if (res.ok) {
        const data = await res.json();
        setUnits(data);
        if (data.length > 0) {
          setUnit(data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch units", err);
    }
  };

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName) return;
    try {
      const res = await fetch("/api/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newUnitName }),
      });
      if (res.ok) {
        setNewUnitName("");
        await fetchUnits();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add unit");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUnit = async (id: string) => {
    if (!confirm(`Are you sure you want to delete unit "${id}"?`)) return;
    try {
      const res = await fetch(`/api/units?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchUnits();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete unit");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) {
          setCatEn(data[0].en);
          setCatBn(data[0].bn);
        }
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatBn) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameBn: newCatBn, nameEn: newCatEn || newCatBn }),
      });
      if (res.ok) {
        setNewCatBn("");
        setNewCatEn("");
        await fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add category");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteCategory = async (en: string) => {
    if (!confirm(`Are you sure you want to delete category "${en}"?`)) return;
    try {
      const res = await fetch(`/api/categories?en=${encodeURIComponent(en)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete category");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const fetchAllData = async () => {
    try {
      const prodRes = await fetch("/api/products?limit=9999");
      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setName("");
    setDesc("");
    setPrice("");
    setStock("");
    setImageUrl("");
    setSku("");
    setUnit("pcs");
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: any) => {
    setEditingProduct(product);
    setName(product.nameBn || product.nameEn);
    setDesc(product.descriptionBn || product.descriptionEn);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setImageUrl(product.images || "");
    setCatEn(product.categoryEn);
    setCatBn(product.categoryBn);
    setSku(product.sku || "");
    setUnit(product.unit || "pcs");
    setIsProductModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
    const method = editingProduct ? "PUT" : "POST";

    const payload = {
      nameEn: name,
      nameBn: name,
      descriptionEn: desc,
      descriptionBn: desc,
      price: parseFloat(price),
      stock: parseInt(stock),
      images: imageUrl,
      categoryEn: catEn,
      categoryBn: catBn,
      sku,
      unit,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Operation failed");
      }

      setIsProductModalOpen(false);
      await fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");
      await fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // WhatsApp Settings Functions
  const fetchWhatsappSettings = async () => {
    setWhatsappLoading(true);
    try {
      const res = await fetch("/api/whatsapp-settings");
      if (res.ok) {
        const data = await res.json();
        const mapped: Record<string, string> = {};
        if (Array.isArray(data)) {
          data.forEach((s: { key: string; value: string }) => {
            mapped[s.key] = s.value;
          });
        }
        setWhatsappSettings(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch WhatsApp settings", err);
    } finally {
      setWhatsappLoading(false);
    }
  };

  const handleSaveWhatsappSettings = async () => {
    setWhatsappSaving(true);
    setWhatsappSaveMsg("");
    try {
      const settingsArray = Object.entries(whatsappSettings).map(([key, value]) => ({
        key,
        value,
      }));
      
      const res = await fetch("/api/whatsapp-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsArray }),
      });

      if (res.ok) {
        setWhatsappSaveMsg("Settings saved successfully!");
        setTimeout(() => setWhatsappSaveMsg(""), 3000);
      } else {
        setWhatsappSaveMsg("Failed to save settings");
      }
    } catch (err) {
      setWhatsappSaveMsg("Error saving settings");
    } finally {
      setWhatsappSaving(false);
    }
  };

  const handleResetWhatsappDefaults = async () => {
    if (!confirm("Reset all WhatsApp messages to default?")) return;
    try {
      // Delete all and re-initialize
      await fetch("/api/whatsapp-settings", { method: "DELETE" });
      await fetchWhatsappSettings();
    } catch (err) {
      console.error("Failed to reset settings", err);
    }
  };

  const updateWhatsappSetting = (key: string, value: string) => {
    setWhatsappSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Site Settings Functions
  const fetchSiteSettings = async () => {
    setSiteSettingsLoading(true);
    try {
      const res = await fetch("/api/site-settings");
      if (res.ok) {
        const data = await res.json();
        const mapped: Record<string, string> = {};
        if (Array.isArray(data)) {
          data.forEach((s: { key: string; value: string }) => {
            mapped[s.key] = s.value;
          });
        }
        setSiteSettings(mapped);
        // Parse payment methods from JSON string
        try {
          const methods = JSON.parse(mapped["payment_methods"] || '["bKash","Nagad","Rocket","COD"]');
          setPaymentMethods(methods);
        } catch {
          setPaymentMethods(["bKash", "Nagad", "Rocket", "COD"]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch site settings", err);
    } finally {
      setSiteSettingsLoading(false);
    }
  };

  const handleSaveSiteSettings = async () => {
    setSiteSettingsSaving(true);
    setSiteSettingsSaveMsg("");
    try {
      // Include payment methods as JSON string
      const settingsToSave = [
        ...Object.entries(siteSettings).map(([key, value]) => ({ key, value })),
        { key: "payment_methods", value: JSON.stringify(paymentMethods) },
      ];

      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsToSave }),
      });

      if (res.ok) {
        setSiteSettingsSaveMsg("Site settings saved successfully!");
        setTimeout(() => setSiteSettingsSaveMsg(""), 3000);
      } else {
        setSiteSettingsSaveMsg("Failed to save site settings");
      }
    } catch (err) {
      setSiteSettingsSaveMsg("Error saving site settings");
    } finally {
      setSiteSettingsSaving(false);
    }
  };

  const handleResetSiteSettings = async () => {
    if (!confirm("Reset all site settings to default?")) return;
    try {
      await fetch("/api/site-settings", { method: "DELETE" });
      await fetchSiteSettings();
    } catch (err) {
      console.error("Failed to reset site settings", err);
    }
  };

  const updateSiteSetting = (key: string, value: string) => {
    setSiteSettings((prev) => ({ ...prev, [key]: value }));
  };

  const addPaymentMethod = () => {
    if (newPaymentMethod.trim() && !paymentMethods.includes(newPaymentMethod.trim())) {
      setPaymentMethods([...paymentMethods, newPaymentMethod.trim()]);
      setNewPaymentMethod("");
    }
  };

  const removePaymentMethod = (method: string) => {
    setPaymentMethods(paymentMethods.filter((m) => m !== method));
  };

  // ===== SECURITY FUNCTIONS =====
  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError("");
    setSecurityMsg("");

    if (!currentPassword) {
      setSecurityError("Current password is required");
      return;
    }
    if (!newEmail && !newPassword) {
      setSecurityError("Provide new email or new password");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setSecurityError("New password and confirmation do not match");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setSecurityError("Password must be at least 6 characters");
      return;
    }

    setSecurityLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newEmail: newEmail || undefined, newPassword: newPassword || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        setSecurityMsg("Credentials updated successfully! Use new credentials for next login.");
        setCurrentPassword("");
        setNewEmail("");
        setNewPassword("");
        setConfirmPassword("");
        if (newEmail) setUser((prev: any) => prev ? { ...prev, email: newEmail } : prev);
      } else {
        setSecurityError(data.error || "Update failed");
      }
    } catch (err: any) {
      setSecurityError(err.message || "Network error");
    } finally {
      setSecurityLoading(false);
    }
  };

  // ===== BACKUP FUNCTIONS =====
  const fetchBackups = async () => {
    setBackupLoading(true);
    try {
      const res = await fetch("/api/backup");
      if (res.ok) {
        const data = await res.json();
        setBackups(data);
      }
    } catch (err) {
      console.error("Failed to fetch backups", err);
    } finally {
      setBackupLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setCreatingBackup(true);
    setBackupMsg("");
    try {
      const res = await fetch("/api/backup", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setBackupMsg(`Backup created! ${data.stats.products} products, ${data.stats.orders} orders, ${data.stats.images} images (${data.stats.sizeKB}KB)`);
        await fetchBackups();
      } else {
        setBackupMsg(data.error || "Backup failed");
      }
    } catch (err: any) {
      setBackupMsg(err.message || "Backup failed");
    } finally {
      setCreatingBackup(false);
      setTimeout(() => setBackupMsg(""), 8000);
    }
  };

  const handleDownloadBackup = async (fileName: string) => {
    try {
      const res = await fetch(`/api/backup?file=${encodeURIComponent(fileName)}`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || "Download failed");
    }
  };

  const handleDeleteBackup = async (fileName: string) => {
    if (!confirm(`Delete backup "${fileName}"?`)) return;
    try {
      await fetch(`/api/backup?file=${encodeURIComponent(fileName)}`, { method: "DELETE" });
      await fetchBackups();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRestoreBackup = async () => {
    if (!restoreFile) {
      alert("Please select a backup file first");
      return;
    }
    const confirmMsg = restoreMode === "full"
      ? "FULL RESTORE: This will DELETE all existing data and replace it with the backup. Continue?"
      : "MERGE RESTORE: This will merge backup data with existing data. Continue?";
    if (!confirm(confirmMsg)) return;

    setRestoringBackup(true);
    setBackupMsg("");
    try {
      const formData = new FormData();
      formData.append("backup", restoreFile);
      formData.append("mode", restoreMode);

      const res = await fetch("/api/backup/restore", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        const parts = Object.entries(data.restored)
          .map(([k, v]) => `${v} ${k}`)
          .join(", ");
        setBackupMsg(`Restore complete! ${parts}`);
        setRestoreFile(null);
        await fetchAllData();
      } else {
        setBackupMsg(data.error || "Restore failed");
      }
    } catch (err: any) {
      setBackupMsg(err.message || "Restore failed");
    } finally {
      setRestoringBackup(false);
      setTimeout(() => setBackupMsg(""), 8000);
    }
  };

  // Load backups when tab is opened
  useEffect(() => {
    if (activeTab === "backup") {
      fetchBackups();
      fetchGdriveSettings();
    }
  }, [activeTab]);

  // ===== GOOGLE DRIVE FUNCTIONS =====
  const fetchGdriveSettings = async () => {
    setGdriveLoading(true);
    try {
      const res = await fetch("/api/google-drive");
      if (res.ok) {
        const data = await res.json();
        setGdriveClientId(data.clientId || "");
        setGdriveClientSecret(data.clientSecret || "");
        setGdriveConnected(data.connected || false);
        if (data.connected) {
          fetchGdriveFiles();
        }
      }
    } catch (err) {
      console.error("Failed to load Google Drive settings", err);
    } finally {
      setGdriveLoading(false);
    }
  };

  const fetchGdriveFiles = async () => {
    try {
      const res = await fetch(`/api/google-drive?action=list&clientId=${encodeURIComponent(gdriveClientId)}&clientSecret=${encodeURIComponent(gdriveClientSecret)}`);
      if (res.ok) {
        const data = await res.json();
        setGdriveFiles(data.files || []);
      }
    } catch (err) {
      console.error("Failed to list Google Drive files", err);
    }
  };

  const handleSaveGdriveSettings = async () => {
    setGdriveLoading(true);
    setGdriveMsg("");
    try {
      const res = await fetch("/api/google-drive", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: gdriveClientId,
          clientSecret: gdriveClientSecret,
          connected: gdriveConnected,
        }),
      });
      if (res.ok) {
        setGdriveMsg("Settings saved!");
        setTimeout(() => setGdriveMsg(""), 3000);
      }
    } catch (err: any) {
      setGdriveMsg(err.message);
    } finally {
      setGdriveLoading(false);
    }
  };

  const handleConnectGdrive = async () => {
    if (!gdriveClientId) {
      setGdriveMsg("Please enter Google Drive Client ID first");
      return;
    }
    try {
      const res = await fetch(`/api/google-drive/auth?clientId=${encodeURIComponent(gdriveClientId)}`);
      const data = await res.json();
      if (data.url) {
        // Save settings first, then redirect
        await handleSaveGdriveSettings();
        window.location.href = data.url;
      }
    } catch (err: any) {
      setGdriveMsg(err.message);
    }
  };

  const handleDisconnectGdrive = async () => {
    if (!confirm("Disconnect Google Drive? You can reconnect anytime.")) return;
    setGdriveConnected(false);
    setGdriveFiles([]);
    try {
      await fetch("/api/google-drive", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: gdriveClientId,
          clientSecret: gdriveClientSecret,
          connected: false,
        }),
      });
      setGdriveMsg("Google Drive disconnected");
    } catch (err: any) {
      setGdriveMsg(err.message);
    }
  };

  const handleGdriveBackup = async () => {
    setGdriveBacking(true);
    setGdriveMsg("");
    try {
      const res = await fetch("/api/google-drive/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: gdriveClientId,
          clientSecret: gdriveClientSecret,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setGdriveMsg(`Backup uploaded to Google Drive! ${data.stats.products} products, ${data.stats.images} images (${data.stats.sizeKB}KB)`);
        fetchGdriveFiles();
      } else {
        setGdriveMsg(data.error || "Backup failed");
      }
    } catch (err: any) {
      setGdriveMsg(err.message || "Backup failed");
    } finally {
      setGdriveBacking(false);
      setTimeout(() => setGdriveMsg(""), 8000);
    }
  };

  // Check URL params for Google Drive callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gdriveSuccess = params.get("gdrive_success");
    const gdriveError = params.get("gdrive_error");
    if (gdriveSuccess) {
      setGdriveConnected(true);
      setGdriveMsg("Google Drive connected successfully!");
      fetchGdriveFiles();
      window.history.replaceState({}, "", "/admin/dashboard");
    }
    if (gdriveError) {
      setGdriveMsg(`Google Drive Error: ${gdriveError}`);
      window.history.replaceState({}, "", "/admin/dashboard");
    }
  }, []);

  // Stats computation
  const totalProducts = products.length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const categoriesCount = new Set(products.map((p) => p.categoryEn)).size;
  const avgPrice = products.length > 0 
    ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / products.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-warm-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-warm-muted animate-pulse">Loading Avorex Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-foreground font-sans flex flex-col">
      {/* Admin Navbar */}
      <header className="w-full bg-[#F9F6EE] border-b border-warm-border/60 py-4 px-6 lg:px-12 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-warm-primary animate-pulse" />
          <span className="font-sans text-xl font-black tracking-wide text-foreground">
            AVOREX <span className="text-warm-primary font-normal font-sans">WORKSPACE</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="hidden sm:inline text-xs font-bold text-warm-muted uppercase tracking-wider">
            Connected as: <span className="text-foreground">{user?.name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-warm-border hover:bg-red-50 hover:text-red-600 transition-all font-bold text-xs cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Stats Cards Row */}
      <section className="px-6 lg:px-12 py-8 max-w-[1650px] mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat 1: Active Spares */}
        <div className="bg-[#F9F6EE] border border-warm-border/50 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] text-warm-muted uppercase tracking-widest font-black">Active Catalog Spares</p>
            <h3 className="text-2xl font-black text-foreground mt-2">{products.length} Items</h3>
          </div>
          <div className="p-3 bg-warm-primary/10 rounded-xl text-warm-primary">
            <Package className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 2: Out of Stock Warning */}
        <div className="bg-[#F9F6EE] border border-warm-border/50 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] text-warm-muted uppercase tracking-widest font-black">Out of Stock</p>
            <h3 className="text-2xl font-black text-red-600 mt-2">{outOfStockCount} Warning</h3>
          </div>
          <div className="p-3 bg-red-50 rounded-xl text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 3: Spares Categories */}
        <div className="bg-[#F9F6EE] border border-warm-border/50 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] text-warm-muted uppercase tracking-widest font-black">Active Categories</p>
            <h3 className="text-2xl font-black text-foreground mt-2">{categoriesCount} Groups</h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Inbox className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 4: Average Spare Price */}
        <div className="bg-[#F9F6EE] border border-warm-border/50 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] text-warm-muted uppercase tracking-widest font-black">Average Spare Price</p>
            <h3 className="text-2xl font-black text-foreground mt-2">৳ {avgPrice.toLocaleString("en-IN")}</h3>
          </div>
          <div className="p-3 bg-green-50 rounded-xl text-green-600">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

      </section>

      {/* Tab Navigation */}
      <section className="px-6 lg:px-12 max-w-[1650px] mx-auto w-full">
        <div className="flex gap-2 border-b border-warm-border/40 pb-0">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-sm font-bold uppercase tracking-wider transition-all border border-b-0 ${
              activeTab === "products"
                ? "bg-[#F9F6EE] border-warm-border/40 text-foreground"
                : "bg-transparent border-transparent text-warm-muted hover:text-foreground hover:bg-warm-primary/5"
            }`}
          >
            <Package className="h-4 w-4" />
            Products
          </button>
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-sm font-bold uppercase tracking-wider transition-all border border-b-0 ${
              activeTab === "whatsapp"
                ? "bg-[#F9F6EE] border-warm-border/40 text-foreground"
                : "bg-transparent border-transparent text-warm-muted hover:text-foreground hover:bg-warm-primary/5"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            WhatsApp Modification
          </button>
          <button
            onClick={() => setActiveTab("site-settings")}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-sm font-bold uppercase tracking-wider transition-all border border-b-0 ${
              activeTab === "site-settings"
                ? "bg-[#F9F6EE] border-warm-border/40 text-foreground"
                : "bg-transparent border-transparent text-warm-muted hover:text-foreground hover:bg-warm-primary/5"
            }`}
          >
            <Globe className="h-4 w-4" />
            Site Settings
          </button>
          <button
            onClick={() => setActiveTab("backup")}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-sm font-bold uppercase tracking-wider transition-all border border-b-0 ${
              activeTab === "backup"
                ? "bg-[#F9F6EE] border-warm-border/40 text-foreground"
                : "bg-transparent border-transparent text-warm-muted hover:text-foreground hover:bg-warm-primary/5"
            }`}
          >
            <Database className="h-4 w-4" />
            Database & Backup
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-sm font-bold uppercase tracking-wider transition-all border border-b-0 ${
              activeTab === "security"
                ? "bg-[#F9F6EE] border-warm-border/40 text-foreground"
                : "bg-transparent border-transparent text-warm-muted hover:text-foreground hover:bg-warm-primary/5"
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            Security
          </button>
        </div>
      </section>

      <main className="flex-1 max-w-[1650px] mx-auto w-full px-6 lg:px-12 pb-16">
        <div className="space-y-6">
          
          {/* PRODUCTS TAB */}
          {activeTab === "products" && (
            <>
              <div className="flex justify-between items-center pt-6">
                <h3 className="text-lg font-bold text-foreground">Active Catalog Spares</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-4 border border-warm-border bg-white text-foreground hover:bg-warm-primary/5 rounded-2xl text-sm font-black tracking-wider uppercase shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    <Settings className="h-5 w-5 text-warm-primary" />
                    <span>Manage Categories</span>
                  </button>
                  <button
                    onClick={handleOpenAddProduct}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-warm-secondary to-warm-primary text-white rounded-2xl text-sm font-black tracking-wider uppercase shadow-lg hover:shadow-warm-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    <Plus className="h-5 w-5 stroke-[3]" />
                    <span>Add New Spare Product</span>
                  </button>
                </div>
              </div>

            {/* Admin Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={adminSearchQuery}
                onChange={(e) => setAdminSearchQuery(e.target.value)}
                placeholder="Search products by name, SKU, or category (নাম, এসকিউ বা ক্যাটাগরি দিয়ে খুঁজুন)..."
                className="w-full bg-[#FAF6EE] py-4.5 px-6 rounded-2xl border border-warm-border focus:outline-none focus:border-warm-primary text-base font-semibold transition-colors shadow-xs"
              />
            </div>

            <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-warm-border/20 text-xs lg:text-sm text-warm-muted uppercase tracking-widest font-black border-b border-warm-border/40">
                    <th className="p-6 w-24 lg:w-28">Spare</th>
                    <th className="p-6">Spare Name (নাম)</th>
                    <th className="p-6">Category</th>
                    <th className="p-6">Price</th>
                    <th className="p-6">Stock</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-border/20 text-sm font-semibold">
                  {products
                    .filter((p) => {
                      const query = adminSearchQuery.toLowerCase().trim();
                      if (!query) return true;
                      return (
                        (p.nameEn && p.nameEn.toLowerCase().includes(query)) ||
                        (p.nameBn && p.nameBn.toLowerCase().includes(query)) ||
                        (p.sku && p.sku.toLowerCase().includes(query)) ||
                        (p.categoryEn && p.categoryEn.toLowerCase().includes(query)) ||
                        (p.categoryBn && p.categoryBn.toLowerCase().includes(query))
                      );
                    })
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-warm-primary/5 transition-colors">
                        <td className="p-6 lg:p-7">
                          <div className="w-16 h-16 lg:w-18 lg:h-18 rounded-xl bg-warm-border/10 overflow-hidden flex items-center justify-center p-1.5 border border-warm-border/30">
                            <img src={getSvgIcon(p.images)} alt="" className="w-full h-full object-contain" />
                          </div>
                        </td>
                        <td className="p-6 lg:p-7 text-base lg:text-lg font-black text-foreground tracking-wide">
                          <div>{p.nameBn || p.nameEn}</div>
                          {p.sku && (
                            <div className="text-xs text-warm-muted mt-1 font-semibold tracking-wider">
                              SKU: <span className="text-warm-accent font-extrabold uppercase">{p.sku}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-6 lg:p-7">
                          <span className="px-3.5 py-1.5 bg-white border border-warm-border/55 text-xs lg:text-sm rounded-xl text-warm-accent font-bold">
                            {p.categoryEn}
                          </span>
                        </td>
                        <td className="p-6 lg:p-7 text-base lg:text-xl font-black text-warm-primary">৳ {p.price.toLocaleString("en-IN")}</td>
                        <td className="p-6 lg:p-7">
                          <span className={`px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-bold ${
                            p.stock === 0 ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"
                          }`}>
                            {p.stock} {p.unit || "pcs"}
                          </span>
                        </td>
                        <td className="p-6 lg:p-7 text-right space-x-3">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-3 text-warm-accent border border-warm-border/40 hover:border-warm-primary bg-white rounded-xl transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-3 text-red-500 border border-warm-border/40 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}

          {/* WHATSAPP MODIFICATION TAB */}
          {activeTab === "whatsapp" && (
            <div className="pt-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-foreground">WhatsApp Message Templates</h3>
                  <p className="text-xs text-warm-muted mt-1 font-semibold">
                    Edit the messages that customers see when they order via WhatsApp. Use placeholders like {"{product_name}"}, {"{price}"}, {"{customer_name}"}, etc.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleResetWhatsappDefaults}
                    className="flex items-center gap-2 px-5 py-3 border border-warm-border bg-white text-warm-muted hover:text-red-500 hover:border-red-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Defaults
                  </button>
                  <button
                    onClick={handleSaveWhatsappSettings}
                    disabled={whatsappSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-green-500/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {whatsappSaving ? "Saving..." : "Save All Changes"}
                  </button>
                </div>
              </div>

              {/* Save Success Message */}
              {whatsappSaveMsg && (
                <div className={`px-4 py-3 rounded-xl text-sm font-bold ${
                  whatsappSaveMsg.includes("success") 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}>
                  {whatsappSaveMsg}
                </div>
              )}

              {/* Loading Indicator */}
              {whatsappLoading && (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-warm-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-warm-muted mt-2 font-semibold">Loading settings...</p>
                </div>
              )}

              {/* Admin WhatsApp Number */}
              <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl p-6 shadow-xs">
                <h4 className="text-sm font-black text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-warm-primary" />
                  Admin WhatsApp Number
                </h4>
                <input
                  type="text"
                  value={whatsappSettings["admin_whatsapp_number"] || ""}
                  onChange={(e) => updateWhatsappSetting("admin_whatsapp_number", e.target.value)}
                  placeholder="8801751567281"
                  className="w-full md:w-96 bg-white py-3 px-5 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold transition-colors"
                />
              </div>

              {/* Payment Numbers */}
              <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl p-6 shadow-xs">
                <h4 className="text-sm font-black text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-warm-primary" />
                  Payment Numbers
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-warm-muted font-bold uppercase tracking-wider">bKash Number</label>
                    <input
                      type="text"
                      value={whatsappSettings["payment_number_bkash"] || ""}
                      onChange={(e) => updateWhatsappSetting("payment_number_bkash", e.target.value)}
                      placeholder="01751567281"
                      className="w-full bg-white py-3 px-5 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-warm-muted font-bold uppercase tracking-wider">Nagad Number</label>
                    <input
                      type="text"
                      value={whatsappSettings["payment_number_nagad"] || ""}
                      onChange={(e) => updateWhatsappSetting("payment_number_nagad", e.target.value)}
                      placeholder="01751567281"
                      className="w-full bg-white py-3 px-5 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Order Messages */}
              <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl p-6 shadow-xs">
                <h4 className="text-sm font-black text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4 text-warm-primary" />
                  Quick Order Message (Single Product)
                </h4>
                <p className="text-xs text-warm-muted mb-4 font-semibold">
                  Placeholders: {"{product_name}"}, {"{price}"}, {"{stock}"}, {"{payment_number}"}
                </p>
                <div className="space-y-2">
                  <label className="text-xs text-warm-accent font-bold uppercase tracking-wider">Bengali (বাংলা)</label>
                  <textarea
                    rows={10}
                    value={whatsappSettings["quick_order_bn"] || ""}
                    onChange={(e) => updateWhatsappSetting("quick_order_bn", e.target.value)}
                    className="w-full bg-white py-3 px-5 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold resize-none transition-colors"
                  />
                </div>
              </div>

              {/* Cart Order Messages */}
              <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl p-6 shadow-xs">
                <h4 className="text-sm font-black text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-warm-primary" />
                  Cart Order Message (Bulk Order)
                </h4>
                <p className="text-xs text-warm-muted mb-4 font-semibold">
                  Placeholders: {"{customer_name}"}, {"{customer_phone}"}, {"{customer_address}"}, {"{payment_method}"}, {"{order_items}"}, {"{total_amount}"}, {"{payment_number}"}
                </p>
                <div className="space-y-2">
                  <label className="text-xs text-warm-accent font-bold uppercase tracking-wider">Bengali (বাংলা)</label>
                  <textarea
                    rows={14}
                    value={whatsappSettings["cart_order_bn"] || ""}
                    onChange={(e) => updateWhatsappSetting("cart_order_bn", e.target.value)}
                    className="w-full bg-white py-3 px-5 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold resize-none transition-colors"
                  />
                </div>
              </div>

              {/* Custom Request Messages */}
              <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl p-6 shadow-xs">
                <h4 className="text-sm font-black text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-warm-primary" />
                  Custom Part Request Message
                </h4>
                <p className="text-xs text-warm-muted mb-4 font-semibold">
                  Placeholders: {"{customer_name}"}, {"{customer_phone}"}, {"{part_name}"}, {"{part_details}"}
                </p>
                <div className="space-y-2">
                  <label className="text-xs text-warm-accent font-bold uppercase tracking-wider">Bengali (বাংলা)</label>
                  <textarea
                    rows={10}
                    value={whatsappSettings["custom_request_bn"] || ""}
                    onChange={(e) => updateWhatsappSetting("custom_request_bn", e.target.value)}
                    className="w-full bg-white py-3 px-5 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold resize-none transition-colors"
                  />
                </div>
              </div>

              {/* Preview Section */}
              <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl p-6 shadow-xs">
                <h4 className="text-sm font-black text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-warm-primary" />
                  Message Preview (with sample data)
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-warm-accent font-bold uppercase tracking-wider">Quick Order Preview</label>
                    <div className="bg-white p-4 rounded-xl border border-warm-border text-xs font-mono whitespace-pre-wrap text-foreground max-h-48 overflow-y-auto">
                      {(whatsappSettings["quick_order_bn"] || "")
                        .replace("{product_name}", "প্রিমিয়াম কার্বুরেটর")
                        .replace("{price}", "4,500")
                        .replace("{stock}", "Available / সচল")
                        .replace("{payment_number}", whatsappSettings["payment_number_bkash"] || "01751567281")}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-warm-accent font-bold uppercase tracking-wider">Cart Order Preview</label>
                    <div className="bg-white p-4 rounded-xl border border-warm-border text-xs font-mono whitespace-pre-wrap text-foreground max-h-48 overflow-y-auto">
                      {(whatsappSettings["cart_order_bn"] || "")
                        .replace("{customer_name}", "রহিম উদ্দিন")
                        .replace("{customer_phone}", "01712345678")
                        .replace("{customer_address}", "ঢাকা, বাংলাদেশ")
                        .replace("{payment_method}", "bKash")
                        .replace("{order_items}", "1. কার্বুরেটর (x2) - ৳ 9,000")
                        .replace("{total_amount}", "9,000")
                        .replace("{payment_number}", whatsappSettings["payment_number_bkash"] || "01751567281")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SITE SETTINGS TAB */}
          {activeTab === "site-settings" && (
            <div className="pt-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Site Settings (সাইট সেটিংস)</h3>
                  <p className="text-xs text-warm-muted mt-1 font-semibold">
                    Edit your business information, contact details, address, business hours, and payment methods shown on the website.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleResetSiteSettings}
                    className="flex items-center gap-2 px-5 py-3 border border-warm-border bg-white text-warm-muted hover:text-red-500 hover:border-red-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Defaults
                  </button>
                  <button
                    onClick={handleSaveSiteSettings}
                    disabled={siteSettingsSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-warm-secondary to-warm-primary text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-warm-primary/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {siteSettingsSaving ? "Saving..." : "Save All Changes"}
                  </button>
                </div>
              </div>

              {/* Save Success Message */}
              {siteSettingsSaveMsg && (
                <div className={`px-4 py-3 rounded-xl text-sm font-bold ${
                  siteSettingsSaveMsg.includes("success") 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}>
                  {siteSettingsSaveMsg}
                </div>
              )}

              {/* Loading Indicator */}
              {siteSettingsLoading && (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-warm-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-warm-muted mt-2 font-semibold">Loading site settings...</p>
                </div>
              )}

              {/* Business Info Section */}
              <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl p-6 shadow-xs">
                <h4 className="text-sm font-black text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-warm-primary" />
                  Business Information (ব্যবসায়িক তথ্য)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-warm-muted font-bold uppercase tracking-wider">Business Name</label>
                    <input
                      type="text"
                      value={siteSettings["business_name"] || ""}
                      onChange={(e) => updateSiteSetting("business_name", e.target.value)}
                      placeholder="AL MAKKA ENTERPRISE"
                      className="w-full bg-white py-3 px-5 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-warm-muted font-bold uppercase tracking-wider">Phone Number</label>
                    <input
                      type="text"
                      value={siteSettings["phone"] || ""}
                      onChange={(e) => updateSiteSetting("phone", e.target.value)}
                      placeholder="+8801751567281"
                      className="w-full bg-white py-3 px-5 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold transition-colors"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs text-warm-muted font-bold uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={siteSettings["email"] || ""}
                      onChange={(e) => updateSiteSetting("email", e.target.value)}
                      placeholder="support@almakkaenterprise.com"
                      className="w-full bg-white py-3 px-5 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl p-6 shadow-xs">
                <h4 className="text-sm font-black text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-warm-primary" />
                  Address (ঠিকানা)
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-warm-accent font-bold uppercase tracking-wider">Bengali (বাংলা)</label>
                    <textarea
                      rows={3}
                      value={siteSettings["address_bn"] || ""}
                      onChange={(e) => updateSiteSetting("address_bn", e.target.value)}
                      className="w-full bg-white py-3 px-5 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold resize-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-warm-accent font-bold uppercase tracking-wider">English</label>
                    <textarea
                      rows={3}
                      value={siteSettings["address_en"] || ""}
                      onChange={(e) => updateSiteSetting("address_en", e.target.value)}
                      className="w-full bg-white py-3 px-5 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold resize-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Business Hours Section */}
              <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl p-6 shadow-xs">
                <h4 className="text-sm font-black text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-warm-primary" />
                  Business Hours (কর্মঘণ্টা)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-warm-muted font-bold uppercase tracking-wider">Saturday - Thursday Hours</label>
                    <input
                      type="text"
                      value={siteSettings["hours_sat_thu"] || ""}
                      onChange={(e) => updateSiteSetting("hours_sat_thu", e.target.value)}
                      placeholder="09:00 AM - 08:00 PM"
                      className="w-full bg-white py-3 px-5 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-warm-muted font-bold uppercase tracking-wider">Friday Status (Bengali)</label>
                    <input
                      type="text"
                      value={siteSettings["hours_fri"] || ""}
                      onChange={(e) => updateSiteSetting("hours_fri", e.target.value)}
                      placeholder="বন্ধ (সাপ্তাহিক ছুটি)"
                      className="w-full bg-white py-3 px-5 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-warm-muted font-bold uppercase tracking-wider">Friday Status (English)</label>
                    <input
                      type="text"
                      value={siteSettings["hours_fri_en"] || ""}
                      onChange={(e) => updateSiteSetting("hours_fri_en", e.target.value)}
                      placeholder="Closed (Weekly Holiday)"
                      className="w-full bg-white py-3 px-5 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods Section */}
              <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl p-6 shadow-xs">
                <h4 className="text-sm font-black text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-warm-primary" />
                  Payment Methods (পেমেন্ট মাধ্যম)
                </h4>
                
                {/* Payment Description */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="text-xs text-warm-accent font-bold uppercase tracking-wider">Description (Bengali)</label>
                    <textarea
                      rows={2}
                      value={siteSettings["payment_description_bn"] || ""}
                      onChange={(e) => updateSiteSetting("payment_description_bn", e.target.value)}
                      className="w-full bg-white py-3 px-5 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold resize-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-warm-accent font-bold uppercase tracking-wider">Description (English)</label>
                    <textarea
                      rows={2}
                      value={siteSettings["payment_description_en"] || ""}
                      onChange={(e) => updateSiteSetting("payment_description_en", e.target.value)}
                      className="w-full bg-white py-3 px-5 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold resize-none transition-colors"
                    />
                  </div>
                </div>

                {/* Current Payment Methods */}
                <div className="space-y-3">
                  <label className="text-xs text-warm-muted font-bold uppercase tracking-wider">Current Payment Methods</label>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethods.map((method) => (
                      <span
                        key={method}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-warm-border bg-white text-sm font-bold text-warm-accent"
                      >
                        {method}
                        <button
                          onClick={() => removePaymentMethod(method)}
                          className="p-0.5 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  {/* Add New Payment Method */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newPaymentMethod}
                      onChange={(e) => setNewPaymentMethod(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPaymentMethod())}
                      placeholder="Add new payment method..."
                      className="flex-1 bg-white py-2.5 px-4 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold transition-colors"
                    />
                    <button
                      onClick={addPaymentMethod}
                      className="px-4 py-2.5 bg-warm-primary text-white rounded-xl font-bold text-sm hover:bg-warm-secondary transition-colors cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
        </main>

      {/* CRUD PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2B2A]/50 backdrop-blur-xs">
          <div className="bg-[#FDFBF7] w-full max-w-5xl rounded-3xl p-12 md:p-14 border border-warm-border shadow-2xl space-y-8 max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-warm-border pb-5">
              <h3 className="text-2xl font-black text-foreground uppercase tracking-widest">
                {editingProduct ? "Modify Spare Record" : "Add New Spare Product"}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)} 
                className="p-2 hover:bg-warm-primary/10 rounded-full text-warm-muted hover:text-warm-primary transition-colors cursor-pointer"
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-8 text-sm font-semibold">
              <div className="space-y-2.5">
                <label className="text-warm-muted uppercase tracking-widest text-xs font-black">Spare Name (পার্টসের নাম)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: প্রিমিয়াম কার্বুরেটর মডেল F10A"
                  className="w-full bg-white py-4 px-6 rounded-2xl border border-warm-border focus:outline-none focus:border-warm-primary text-base font-semibold transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-warm-muted uppercase tracking-widest text-xs font-black">Price (BDT ৳)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 4500"
                    className="w-full bg-white py-4 px-6 rounded-2xl border border-warm-border focus:outline-none text-base font-semibold transition-colors"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-warm-muted uppercase tracking-widest text-xs font-black">In-Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="e.g. 12"
                    className="w-full bg-white py-4 px-6 rounded-2xl border border-warm-border focus:outline-none text-base font-semibold transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-warm-muted uppercase tracking-widest text-xs font-black">SKU Code (এসকিউ কোড)</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="যেমন: CNG-101"
                    className="w-full bg-white py-4 px-6 rounded-2xl border border-warm-border focus:outline-none text-base font-semibold transition-colors"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-warm-muted uppercase tracking-widest text-xs font-black">Product Unit (ইউনিট)</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-white py-4 px-6 rounded-2xl border border-warm-border focus:outline-none text-base font-semibold cursor-pointer"
                  >
                    <option value="pcs">Pcs (পিস)</option>
                    <option value="kg">Kg (কেজি)</option>
                    <option value="set">Set (সেট)</option>
                    <option value="box">Box (বক্স)</option>
                    <option value="meter">Meter (মিটার)</option>
                    <option value="liter">Liter (লিটার)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-warm-muted uppercase tracking-widest text-xs font-black">Category (ক্যাটাগরি)</label>
                <select
                  value={catEn}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCatEn(val);
                    const selected = categories.find((c) => c.en === val);
                    if (selected) {
                      setCatBn(selected.bn);
                    }
                  }}
                  className="w-full bg-white py-4 px-6 rounded-2xl border border-warm-border focus:outline-none text-base font-semibold cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.en} value={c.en}>
                      {c.en} ({c.bn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2.5">
                <label className="text-warm-muted uppercase tracking-widest text-xs font-black">Product Image (প্রোডাক্টের ছবি)</label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-file-input"
                    />
                    <label
                      htmlFor="image-file-input"
                      className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl border border-dashed border-warm-border hover:border-warm-primary bg-white text-base font-semibold cursor-pointer transition-all active:scale-99"
                    >
                      {uploading ? "Uploading..." : imageUrl ? "Change Image (ছবি পরিবর্তন করুন)" : "Choose Image (ছবি সিলেক্ট করুন)"}
                    </label>
                  </div>
                  {imageUrl && (
                    <div className="w-18 h-18 rounded-2xl bg-warm-border/10 overflow-hidden flex items-center justify-center p-1.5 border border-warm-border/30">
                      <img src={imageUrl} alt="" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-warm-muted uppercase tracking-widest text-xs font-black">Description (পার্টসের বিবরণ)</label>
                <textarea
                  rows={4}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="পার্টসটির বিবরণ ও ফিটিং করার নির্দেশিকা বাংলায় লিখুন..."
                  className="w-full bg-white py-4 px-6 rounded-2xl border border-warm-border focus:outline-none text-base font-semibold resize-none transition-colors"
                />
              </div>

              <div className="flex gap-6 pt-6 border-t border-warm-border/30">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-4 border border-warm-border rounded-xl font-bold text-warm-muted hover:bg-warm-primary/5 transition-colors cursor-pointer text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-warm-secondary to-warm-primary text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all cursor-pointer text-xs uppercase tracking-widest"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2B2A]/50 backdrop-blur-xs">
          <div className="bg-[#FDFBF7] w-full max-w-xl rounded-3xl p-8 border border-warm-border shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-warm-border pb-4">
              <h3 className="text-xl font-black text-foreground uppercase tracking-widest">
                Manage Categories
              </h3>
              <button 
                onClick={() => setIsCategoryModalOpen(false)} 
                className="p-1.5 hover:bg-warm-primary/10 rounded-full text-warm-muted hover:text-warm-primary transition-colors cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* List of categories */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-warm-muted">Active Categories</h4>
              <div className="divide-y divide-warm-border/20 border border-warm-border/35 rounded-2xl bg-[#F9F6EE]/40 max-h-60 overflow-y-auto p-2">
                {categories.map((c) => (
                  <div key={c.en} className="flex justify-between items-center py-2 px-3 hover:bg-warm-primary/5 rounded-xl transition-all">
                    <span className="text-sm font-bold text-foreground">
                      {c.en} <span className="text-xs font-semibold text-warm-muted ml-1.5">({c.bn})</span>
                    </span>
                    <button
                      onClick={() => handleDeleteCategory(c.en)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove Category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} className="space-y-4 pt-4 border-t border-warm-border/30">
              <h4 className="text-xs font-black uppercase tracking-wider text-warm-muted">Add New Category</h4>
              <div className="space-y-1.5">
                <label className="text-[10px] text-warm-muted font-bold uppercase tracking-wider">Category Name (ক্যাটাগরির নাম)</label>
                <input
                  type="text"
                  required
                  value={newCatBn}
                  onChange={(e) => {
                    setNewCatBn(e.target.value);
                    setNewCatEn(e.target.value);
                  }}
                  placeholder="যেমন: সিলিন্ডার বা Cylinders"
                  className="w-full bg-white py-3 px-4 rounded-xl border border-warm-border focus:outline-none focus:border-warm-primary text-sm font-semibold transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-warm-secondary to-warm-primary text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all cursor-pointer text-xs uppercase tracking-widest"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DATABASE & BACKUP TAB */}
      {activeTab === "backup" && (
        <div className="pt-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-warm-primary/10 rounded-xl">
              <Database className="h-5 w-5 text-warm-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Database & Backup</h3>
              <p className="text-[11px] text-warm-muted font-medium">ডাটাবেস ও ব্যাকআপ — Manage all your data backups</p>
            </div>
          </div>

          {/* Status Message */}
          {(backupMsg || gdriveMsg) && (
            <div className={`px-5 py-3.5 rounded-xl text-sm font-bold shadow-sm ${
              (backupMsg || gdriveMsg).includes("fail") || (backupMsg || gdriveMsg).includes("error") || (backupMsg || gdriveMsg).includes("Error")
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}>
              {backupMsg || gdriveMsg}
            </div>
          )}

          {/* Section Title - Local */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-1 bg-warm-primary rounded-full"></div>
            <h4 className="text-sm font-black text-foreground uppercase tracking-wide">Local Backup</h4>
            <p className="text-[11px] text-warm-muted font-medium">— লোকাল ব্যাকআপ</p>
          </div>

          {/* Local Backup Cards - 3 Column */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Create Backup Card */}
            <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 bg-warm-primary/15 rounded-lg">
                  <HardDrive className="h-4 w-4 text-warm-primary" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-foreground">Create Backup</h5>
                  <p className="text-[10px] text-warm-muted font-medium">ব্যাকআপ তৈরি করুন</p>
                </div>
              </div>
              <p className="text-[11px] text-warm-muted mb-4 font-medium leading-relaxed">
                Download all data as a JSON file to your computer.
              </p>
              <button
                onClick={handleCreateBackup}
                disabled={creatingBackup}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-warm-secondary to-warm-primary text-white rounded-xl text-[11px] font-black uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-warm-primary/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {creatingBackup ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
                {creatingBackup ? "Creating..." : "Download Backup"}
              </button>
            </div>

            {/* Restore Card */}
            <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 bg-warm-accent/15 rounded-lg">
                  <Upload className="h-4 w-4 text-warm-accent" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-foreground">Restore Data</h5>
                  <p className="text-[10px] text-warm-muted font-medium">ডাটা রিস্টোর করুন</p>
                </div>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
                className="w-full bg-white py-2 px-3 rounded-lg border border-warm-border focus:outline-none focus:border-warm-primary text-[11px] font-semibold transition-colors file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:bg-warm-primary file:text-white file:text-[10px] file:font-bold file:cursor-pointer mb-3"
              />
              <div className="flex items-center gap-2 mb-3">
                <label className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-warm-border bg-white text-[10px] font-bold cursor-pointer hover:bg-warm-primary/5 transition-colors">
                  <input type="radio" name="restoreMode" value="full" checked={restoreMode === "full"} onChange={() => setRestoreMode("full")} className="accent-warm-primary" />
                  Full
                </label>
                <label className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-warm-border bg-white text-[10px] font-bold cursor-pointer hover:bg-warm-primary/5 transition-colors">
                  <input type="radio" name="restoreMode" value="merge" checked={restoreMode === "merge"} onChange={() => setRestoreMode("merge")} className="accent-warm-primary" />
                  Merge
                </label>
              </div>
              <button
                onClick={handleRestoreBackup}
                disabled={!restoreFile || restoringBackup}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-warm-accent to-warm-secondary text-white rounded-xl text-[11px] font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {restoringBackup ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                {restoringBackup ? "Restoring..." : "Restore Now"}
              </button>
            </div>

            {/* Backup List Card */}
            <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 bg-warm-border/60 rounded-lg">
                  <FileJson className="h-4 w-4 text-warm-muted" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-foreground">Saved Backups</h5>
                  <p className="text-[10px] text-warm-muted font-medium">সংরক্ষিত ({backups.length})</p>
                </div>
              </div>
              {backupLoading ? (
                <div className="text-center py-6">
                  <div className="w-6 h-6 border-2 border-warm-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : backups.length === 0 ? (
                <div className="text-center py-6">
                  <HardDrive className="h-8 w-8 text-warm-border mx-auto mb-2" />
                  <p className="text-[11px] text-warm-muted font-medium">No backups yet</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                  {backups.slice(0, 5).map((b) => (
                    <div key={b.fileName} className="flex items-center justify-between gap-2 p-2 bg-white border border-warm-border/30 rounded-lg hover:border-warm-primary/30 transition-all">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-foreground truncate">{b.fileName}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[8px] text-warm-muted font-semibold">{new Date(b.createdAt).toLocaleDateString()}</span>
                          <span className="text-[8px] px-1 py-0.5 bg-warm-primary/10 text-warm-accent rounded font-bold">{b.products}p</span>
                          <span className="text-[8px] px-1 py-0.5 bg-warm-border/50 text-warm-muted rounded font-bold">{b.sizeKB}KB</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button onClick={() => handleDownloadBackup(b.fileName)} className="p-1.5 text-warm-primary hover:bg-warm-primary/10 rounded-md transition-colors cursor-pointer" title="Download">
                          <Download className="h-3 w-3" />
                        </button>
                        <button onClick={() => handleDeleteBackup(b.fileName)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer" title="Delete">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Restore Warning */}
          <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50/80 border border-amber-200/60 rounded-xl">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 font-medium">
              <strong>Full</strong> = delete all existing data + restore backup. <strong>Merge</strong> = upsert only (keeps existing data).
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-warm-border/40"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="px-4 bg-white">
                <div className="w-2 h-2 bg-warm-primary/40 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Section Title - Google Drive */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-1 bg-blue-500 rounded-full"></div>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 19.5H22L12 2Z" fill="#4285F4"/>
              <path d="M12 2L7 19.5H22L12 2Z" fill="#34A853"/>
              <path d="M7 19.5L2 19.5L7 10L12 19.5H7Z" fill="#FBBC05"/>
            </svg>
            <h4 className="text-sm font-black text-foreground uppercase tracking-wide">Google Drive Sync</h4>
            <p className="text-[11px] text-warm-muted font-medium">— গুগল ড্রাইভ</p>
          </div>

          {/* Google Drive Cards - 3 Column */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* GDrive Settings Card */}
            <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 19.5H22L12 2Z" fill="#4285F4"/>
                    <path d="M12 2L7 19.5H22L12 2Z" fill="#34A853"/>
                    <path d="M7 19.5L2 19.5L7 10L12 19.5H7Z" fill="#FBBC05"/>
                  </svg>
                </div>
                <div>
                  <h5 className="text-xs font-black text-foreground">Drive Settings</h5>
                  <p className="text-[10px] text-warm-muted font-medium">সেটিংস</p>
                </div>
              </div>
              <div className="space-y-2.5">
                <input
                  type="text"
                  value={gdriveClientId}
                  onChange={(e) => setGdriveClientId(e.target.value)}
                  placeholder="Client ID"
                  className="w-full bg-white py-2 px-3 rounded-lg border border-warm-border focus:outline-none focus:border-blue-400 text-[11px] font-semibold transition-colors"
                />
                <input
                  type="password"
                  value={gdriveClientSecret}
                  onChange={(e) => setGdriveClientSecret(e.target.value)}
                  placeholder="Client Secret"
                  className="w-full bg-white py-2 px-3 rounded-lg border border-warm-border focus:outline-none focus:border-blue-400 text-[11px] font-semibold transition-colors"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveGdriveSettings}
                    disabled={gdriveLoading}
                    className="flex items-center gap-1 px-3 py-1.5 border border-warm-border bg-white rounded-lg text-[10px] font-bold hover:bg-warm-primary/5 transition-colors cursor-pointer"
                  >
                    <Save className="h-3 w-3" />
                    Save
                  </button>
                  {gdriveConnected ? (
                    <button
                      onClick={handleDisconnectGdrive}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-[10px] font-bold hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={handleConnectGdrive}
                      disabled={!gdriveClientId || !gdriveClientSecret}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Connect
                    </button>
                  )}
                </div>
                {/* Status */}
                <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${
                  gdriveConnected
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${gdriveConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                  {gdriveConnected ? "Connected" : "Not connected"}
                </div>
              </div>
            </div>

            {/* GDrive Backup Card */}
            <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Upload className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-foreground">Backup to Drive</h5>
                  <p className="text-[10px] text-warm-muted font-medium">ড্রাইভে ব্যাকআপ</p>
                </div>
              </div>
              <p className="text-[11px] text-warm-muted mb-4 font-medium leading-relaxed">
                Creates backup in "Avorex E-Commarce Website" folder on your Drive.
              </p>
              <button
                onClick={handleGdriveBackup}
                disabled={!gdriveConnected || gdriveBacking}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {gdriveBacking ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                {gdriveBacking ? "Backing up..." : "Backup to Drive"}
              </button>
              {!gdriveConnected && (
                <p className="text-[9px] text-warm-muted mt-2 text-center font-medium">
                  Connect Google account first
                </p>
              )}
            </div>

            {/* GDrive List Card */}
            <div className="bg-[#F9F6EE] border border-warm-border/40 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 19.5H22L12 2Z" fill="#4285F4"/>
                    <path d="M12 2L7 19.5H22L12 2Z" fill="#34A853"/>
                  </svg>
                </div>
                <div>
                  <h5 className="text-xs font-black text-foreground">Drive Backups</h5>
                  <p className="text-[10px] text-warm-muted font-medium">ড্রাইভ ব্যাকআপ ({gdriveFiles.length})</p>
                </div>
              </div>
              {!gdriveConnected ? (
                <div className="text-center py-6">
                  <svg className="h-8 w-8 mx-auto mb-2 text-gray-300" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 19.5H22L12 2Z" fill="currentColor"/>
                  </svg>
                  <p className="text-[11px] text-warm-muted font-medium">Connect to see backups</p>
                </div>
              ) : gdriveFiles.length === 0 ? (
                <div className="text-center py-6">
                  <Upload className="h-8 w-8 text-warm-border mx-auto mb-2" />
                  <p className="text-[11px] text-warm-muted font-medium">No backups yet</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                  {gdriveFiles.slice(0, 5).map((f) => (
                    <div key={f.id} className="flex items-center justify-between gap-2 p-2 bg-white border border-warm-border/30 rounded-lg hover:border-blue-300 transition-all">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-foreground truncate">{f.name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[8px] text-warm-muted font-semibold">
                            {f.createdTime ? new Date(f.createdTime).toLocaleDateString() : "—"}
                          </span>
                          {f.size && (
                            <span className="text-[8px] px-1 py-0.5 bg-warm-border/50 text-warm-muted rounded font-bold">
                              {Math.round(Number(f.size) / 1024)}KB
                            </span>
                          )}
                        </div>
                      </div>
                      <a
                        href={`https://drive.google.com/file/d/${f.id}/view`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Open in Drive"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECURITY TAB */}
      {activeTab === "security" && (
        <main className="flex-1 max-w-[1650px] mx-auto w-full px-6 lg:px-12 pb-16">
          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-warm-primary" />
              <h3 className="text-lg font-bold text-foreground">Change Login Credentials</h3>
            </div>
            <p className="text-sm text-warm-muted">
              Update your admin email and password. Current password is required for verification.
            </p>

            <form onSubmit={handleUpdateCredentials} className="max-w-lg space-y-5 bg-white border border-warm-border/30 rounded-2xl p-6">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">Current Password *</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-warm-border/40 rounded-xl text-sm focus:outline-none focus:border-warm-primary"
                  required
                />
              </div>

              {/* New Email */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">New Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder={user?.email || "Leave blank to keep current"}
                  className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-warm-border/40 rounded-xl text-sm focus:outline-none focus:border-warm-primary"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-warm-border/40 rounded-xl text-sm focus:outline-none focus:border-warm-primary"
                />
              </div>

              {/* Confirm Password */}
              {newPassword && (
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6EE] border border-warm-border/40 rounded-xl text-sm focus:outline-none focus:border-warm-primary"
                  />
                </div>
              )}

              {/* Error / Success Messages */}
              {securityError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                  {securityError}
                </div>
              )}
              {securityMsg && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                  {securityMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={securityLoading}
                className="w-full py-2.5 bg-warm-primary text-white font-bold text-sm rounded-xl hover:bg-warm-accent transition-colors disabled:opacity-50"
              >
                {securityLoading ? "Updating..." : "Update Credentials"}
              </button>
            </form>
          </div>
        </main>
      )}

    </div>
  );
}
