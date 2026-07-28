// JobEdit.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  RefreshCw,
  Briefcase,
  IndianRupee,
  Search,
  X,
  Calendar,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Indent,
  Outdent,
  ChevronDown,
  Check,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  Layers,
  DollarSign,
  GraduationCap,
  FileText,
  Users,
  ArrowLeft,
  Save,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import {
  fetchJobById,
  updateJob,
  fetchLookup,
  LOOKUP_CONFIG,
  didLookupFallback,
  didLookupFail,
  clearLookupCache,
} from "../../services/JobEditService";

/* ---------------------------------------------------------- */
/* UI Components                                                */
/* ---------------------------------------------------------- */
function GradientSection({ children, className = "" }) {
  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br from-white to-purple-50/30 p-4 sm:p-6 shadow-lg shadow-purple-100/20 border border-purple-100/50 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 h-32 w-32 rounded-full bg-purple-200/20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 h-32 w-32 rounded-full bg-blue-200/20 blur-2xl"></div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function Field({ label, required, error, children, hint }) {
  return (
    <div className="group">
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-xs text-gray-400 flex items-center gap-1">{hint}</p>
      )}
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-500 animate-shake">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border-2 bg-white/80 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-4 focus:ring-purple-200/50 backdrop-blur-sm";
const inputOk = "border-gray-200 hover:border-purple-300 focus:border-purple-500";
const inputErr = "border-red-300 focus:border-red-400 focus:ring-red-200/50";

function Chip({ text, onRemove, icon }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-50 to-purple-100/80 px-3 py-1 text-xs font-medium text-purple-700 border border-purple-200/50 shadow-sm">
      {icon && <span className="text-purple-400">{icon}</span>}
      {text}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-0.5 hover:bg-purple-200/50 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function SelectDropdown({ options = [], value, onChange, placeholder, error, loading, failed, onOpen, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const safeOptions = Array.isArray(options) ? options : [];
  const selected = safeOptions.find((o) => o.id === value);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const handleToggle = () => {
    setOpen((o) => {
      const next = !o;
      if (next && onOpen) onOpen();
      return next;
    });
  };

  return (
    <div className="relative" ref={ref}>
      {label && <label className="mb-1.5 block text-xs font-medium text-gray-600">{label}</label>}
      <button
        type="button"
        onClick={handleToggle}
        className={`${inputBase} ${error ? inputErr : inputOk} flex items-center justify-between text-left`}
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> : selected ? selected.name : placeholder}
        </span>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        ) : (
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        )}
      </button>
      {open && (
        <div className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-purple-100 bg-white shadow-xl">
          {loading && <p className="px-4 py-3 text-xs text-gray-400">Loading options...</p>}
          {!loading && failed && (
            <button
              type="button"
              onClick={() => onOpen && onOpen(true)}
              className="flex w-full items-center gap-1.5 px-4 py-3 text-left text-xs font-medium text-red-500 hover:bg-red-50"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Couldn't load — tap to retry
            </button>
          )}
          {!loading && !failed && safeOptions.length === 0 && (
            <p className="px-4 py-3 text-xs text-gray-400">No options</p>
          )}
          {!loading &&
            safeOptions.map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent transition-all"
              >
                {opt.name}
                {value === opt.id && <Check className="h-4 w-4 text-purple-600" />}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

function MultiSelectSearch({ options = [], selectedIds = [], onChange, placeholder, loading, failed, onOpen, label }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const safeOptions = Array.isArray(options) ? options : [];
  const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : [];
  const selectedOptions = safeOptions.filter((o) => safeSelectedIds.includes(o.id));
  const filtered = safeOptions.filter(
    (o) => o.name?.toLowerCase().includes(query.toLowerCase()) && !safeSelectedIds.includes(o.id)
  );

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const add = (id) => {
    onChange(Array.from(new Set([...safeSelectedIds, id])));
    setQuery("");
  };
  const remove = (id) => onChange(safeSelectedIds.filter((s) => s !== id));

  return (
    <div className="relative" ref={ref}>
      {label && <label className="mb-1.5 block text-xs font-medium text-gray-600">{label}</label>}
      <div className="flex min-h-[52px] w-full flex-wrap items-center gap-1.5 rounded-xl border-2 border-gray-200 bg-white/80 px-3 py-2 transition-all duration-200 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-200/50 backdrop-blur-sm hover:border-purple-300">
        {selectedOptions.map((o) => (
          <Chip key={o.id} text={o.name} onRemove={() => remove(o.id)} />
        ))}
        <div className="flex flex-1 items-center gap-1.5 min-w-[120px]">
          {loading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-gray-400" />
          ) : (
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
          )}
          <input
            type="text"
            value={query}
            onFocus={() => {
              setOpen(true);
              if (onOpen) onOpen();
            }}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={selectedOptions.length === 0 ? (loading ? "Loading..." : placeholder) : ""}
            className="w-full min-w-[80px] flex-1 border-none bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
          />
        </div>
      </div>
      {open && (
        <div className="absolute z-20 mt-2 max-h-52 w-full overflow-y-auto rounded-xl border border-purple-100 bg-white shadow-xl">
          {loading && <p className="px-4 py-3 text-xs text-gray-400">Loading options...</p>}
          {!loading && failed && (
            <button
              type="button"
              onClick={() => onOpen && onOpen(true)}
              className="flex w-full items-center gap-1.5 px-4 py-3 text-left text-xs font-medium text-red-500 hover:bg-red-50"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Couldn't load — tap to retry
            </button>
          )}
          {!loading && !failed && filtered.length === 0 && (
            <p className="px-4 py-3 text-xs text-gray-400">No matches found</p>
          )}
          {!loading &&
            filtered.map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => add(opt.id)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent transition-all"
              >
                {opt.name}
                <Plus className="h-4 w-4 text-purple-400" />
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

function CategoryCheckboxDropdown({
  categories = [],
  subItems = [],
  selectedCategoryIds = [],
  selectedSubIds = [],
  onChangeCategories,
  onChangeSubs,
  placeholder = "Select",
  loading = false,
  failed = false,
  onOpen,
  label,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const ref = useRef(null);

  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeSubItems = Array.isArray(subItems) ? subItems : [];

  const subsForActive = activeCategory ? safeSubItems.filter((s) => s.parentId === activeCategory) : [];

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (open && activeCategory == null && safeCategories.length > 0) {
      setActiveCategory(selectedCategoryIds[0] ?? safeCategories[0].id);
    }
  }, [open, safeCategories, selectedCategoryIds, activeCategory]);

  const handleToggleOpen = () => {
    setOpen((o) => {
      const next = !o;
      if (next && onOpen) onOpen();
      return next;
    });
  };

  const filteredCategories = safeCategories.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()));

  const toggleCategorySelected = (id) => {
    const isSelected = selectedCategoryIds.includes(id);
    if (isSelected) {
      onChangeCategories(selectedCategoryIds.filter((c) => c !== id));
      const idsToDrop = safeSubItems.filter((s) => s.parentId === id).map((s) => s.id);
      onChangeSubs(selectedSubIds.filter((s) => !idsToDrop.includes(s)));
    } else {
      onChangeCategories(Array.from(new Set([...selectedCategoryIds, id])));
    }
  };

  const toggleSub = (id) => {
    if (selectedSubIds.includes(id)) onChangeSubs(selectedSubIds.filter((s) => s !== id));
    else onChangeSubs(Array.from(new Set([...selectedSubIds, id])));
  };

  const removeCategory = (id) => toggleCategorySelected(id);
  const removeSub = (id) => onChangeSubs(selectedSubIds.filter((s) => s !== id));

  const selectedCategoryNames = safeCategories.filter((c) => selectedCategoryIds.includes(c.id));
  const selectedSubNames = safeSubItems.filter((s) => selectedSubIds.includes(s.id));
  const totalSelected = selectedCategoryNames.length + selectedSubNames.length;

  return (
    <div className="relative" ref={ref}>
      {label && <label className="mb-1.5 block text-xs font-medium text-gray-600">{label}</label>}
      <button
        type="button"
        onClick={handleToggleOpen}
        className={`${inputBase} ${inputOk} flex min-h-[52px] flex-wrap items-center gap-1.5 text-left`}
      >
        {loading ? (
          <span className="flex items-center gap-2 text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </span>
        ) : totalSelected === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          <>
            {selectedCategoryNames.slice(0, 2).map((c) => (
              <Chip key={`c-${c.id}`} text={c.name} onRemove={() => removeCategory(c.id)} />
            ))}
            {selectedSubNames.slice(0, 2).map((s) => (
              <Chip key={`s-${s.id}`} text={s.name} onRemove={() => removeSub(s.id)} />
            ))}
            {totalSelected > 4 && <span className="text-xs font-medium text-purple-600">+{totalSelected - 4} more</span>}
          </>
        )}
        <ChevronDown className={`ml-auto h-4 w-4 shrink-0 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-purple-100 bg-white shadow-xl">
          <div className="border-b border-purple-100/50 bg-gradient-to-r from-purple-50/50 to-transparent p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories..."
                className="w-full rounded-lg border border-gray-200 bg-white/80 py-2 pl-9 pr-3 text-sm outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-200/50"
              />
            </div>
          </div>
          {loading ? (
            <p className="px-4 py-4 text-xs text-gray-400">Loading...</p>
          ) : failed ? (
            <button
              type="button"
              onClick={() => onOpen && onOpen(true)}
              className="flex w-full items-center gap-1.5 px-4 py-4 text-left text-xs font-medium text-red-500 hover:bg-red-50"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Couldn't load — tap to retry
            </button>
          ) : (
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              <div className="max-h-64 overflow-y-auto py-1">
                {filteredCategories.length === 0 && <p className="px-4 py-3 text-xs text-gray-400">No categories found</p>}
                {filteredCategories.map((cat) => {
                  const subCount = safeSubItems.filter((s) => s.parentId === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-sm transition-all ${
                        activeCategory === cat.id ? "bg-gradient-to-r from-purple-50 to-transparent text-purple-700" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes(cat.id)}
                        onChange={() => toggleCategorySelected(cat.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 shrink-0 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="flex-1 truncate font-medium">{cat.name}</span>
                      <span className="text-xs text-gray-400">({subCount})</span>
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 -rotate-90 text-gray-300" />
                    </div>
                  );
                })}
              </div>

              <div className="max-h-64 overflow-y-auto py-1">
                {activeCategory == null ? (
                  <p className="px-4 py-3 text-xs text-gray-400">Select a category</p>
                ) : subsForActive.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-gray-400">No sub-items available</p>
                ) : (
                  subsForActive.map((sub) => (
                    <label
                      key={sub.id}
                      className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubIds.includes(sub.id)}
                        onChange={() => toggleSub(sub.id)}
                        className="h-4 w-4 shrink-0 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="flex-1 truncate">{sub.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-purple-100/50 bg-gradient-to-r from-purple-50/30 to-transparent px-4 py-2.5">
            <button
              type="button"
              onClick={() => {
                onChangeCategories([]);
                onChangeSubs([]);
              }}
              className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-200 hover:shadow-lg transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RichTextEditor({ value, onChange, error }) {
  const editorRef = useRef(null);
  const isFocused = useRef(false);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (isFocused.current) return;
    if (el.innerHTML !== (value || "")) {
      el.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = (e) => onChange(e.currentTarget.innerHTML);

  const exec = (cmd, arg = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
    onChange(editorRef.current?.innerHTML || "");
  };

  const handleClear = () => {
    if (editorRef.current) editorRef.current.innerHTML = "";
    onChange("");
  };

  const ToolBtn = ({ icon: Icon, cmd, arg, title }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => exec(cmd, arg)}
      className="rounded-lg p-2 text-gray-500 hover:bg-purple-100 hover:text-purple-700 transition-all"
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div
      className={`overflow-hidden rounded-xl border-2 ${error ? inputErr : inputOk} bg-white/80 backdrop-blur-sm transition-all duration-200 focus-within:ring-4 focus-within:ring-purple-200/50`}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-transparent px-3 py-2">
        <ToolBtn icon={Bold} cmd="bold" title="Bold" />
        <ToolBtn icon={Italic} cmd="italic" title="Italic" />
        <ToolBtn icon={Underline} cmd="underline" title="Underline" />
        <span className="mx-1 h-6 w-px bg-gray-200" />
        <ToolBtn icon={ListOrdered} cmd="insertOrderedList" title="Numbered list" />
        <ToolBtn icon={List} cmd="insertUnorderedList" title="Bullet list" />
        <ToolBtn icon={Outdent} cmd="outdent" title="Decrease indent" />
        <ToolBtn icon={Indent} cmd="indent" title="Increase indent" />
        <span className="mx-1 h-6 w-px bg-gray-200" />
        <select
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => exec("formatBlock", e.target.value)}
          defaultValue=""
          className="rounded-lg border-none bg-transparent px-2 py-1 text-xs text-gray-600 outline-none hover:bg-gray-100"
        >
          <option value="">Normal</option>
          <option value="H1">Heading 1</option>
          <option value="H2">Heading 2</option>
          <option value="H3">Heading 3</option>
        </select>
        <button
          type="button"
          onClick={handleClear}
          className="ml-auto rounded-lg px-3 py-1 text-xs font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          Clear
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => (isFocused.current = true)}
        onBlur={() => (isFocused.current = false)}
        onInput={handleInput}
        data-placeholder="Outlines the roles and responsibilities the candidate will perform in this role."
        className="min-h-[160px] w-full px-4 py-3 text-sm text-gray-800 outline-none empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)]"
      />
    </div>
  );
}

/* ---------------------------------------------------------- */
/* Static option lists                                          */
/* ---------------------------------------------------------- */
const POSTING_TYPES = [
  { id: "Permanent", name: "Permanent", icon: Briefcase },
  { id: "Contract", name: "Contract", icon: FileText },
  { id: "Walk-in", name: "Walk-in", icon: Users },
];
const AUTO_RENEW_OPTIONS = [
  { id: "off", name: "Off" },
  { id: "weekly", name: "Weekly" },
  { id: "monthly", name: "Monthly" },
];
const BILLING_TYPES = [
  { id: "hourly", name: "Hourly" },
  { id: "monthly", name: "Monthly" },
  { id: "fixed", name: "Fixed price" },
];
const QUESTION_TYPES = [
  { id: "yesno", name: "Yes / No" },
  { id: "text", name: "Text answer" },
  { id: "mcq", name: "Multiple choice" },
];

const SECTIONS = [
  { key: "details", label: "Details", icon: FileText },
  { key: "requirements", label: "Requirements", icon: Layers },
  { key: "compensation", label: "Compensation", icon: DollarSign },
  { key: "additional", label: "Additional", icon: GraduationCap },
];

export default function JobEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [activeSection, setActiveSection] = useState("details");

  const sectionRefs = {
    details: useRef(null),
    requirements: useRef(null),
    compensation: useRef(null),
    additional: useRef(null),
  };

  const scrollToSection = (key) => {
    setActiveSection(key);
    sectionRefs[key].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const lookupKeys = Object.keys(LOOKUP_CONFIG);
  const [lookups, setLookups] = useState(Object.fromEntries(lookupKeys.map((k) => [k, []])));
  const [lookupLoading, setLookupLoading] = useState(Object.fromEntries(lookupKeys.map((k) => [k, false])));
  const [lookupFailed, setLookupFailed] = useState(Object.fromEntries(lookupKeys.map((k) => [k, false])));
  const [lookupWarning, setLookupWarning] = useState(false);
  const requestedRef = useRef({});

  const ensureLookup = useCallback((key, forceRetry = false) => {
    if (requestedRef.current[key] && !forceRetry) return;
    requestedRef.current[key] = true;

    setLookupLoading((prev) => ({ ...prev, [key]: true }));
    setLookupFailed((prev) => ({ ...prev, [key]: false }));

    if (forceRetry) clearLookupCache(key);

    fetchLookup(key).then((list) => {
      setLookups((prev) => ({ ...prev, [key]: list }));
      setLookupLoading((prev) => ({ ...prev, [key]: false }));
      if (didLookupFallback(key)) setLookupWarning(true);
      if (didLookupFail(key)) {
        setLookupFailed((prev) => ({ ...prev, [key]: true }));
        delete requestedRef.current[key];
      }
    });
  }, []);

  const ensureIndustry = useCallback(
    (forceRetry) => {
      ensureLookup("industries", forceRetry);
      ensureLookup("subIndustries", forceRetry);
    },
    [ensureLookup]
  );

  const ensurePerks = useCallback(
    (forceRetry) => {
      ensureLookup("perkCategories", forceRetry);
      ensureLookup("perks", forceRetry);
    },
    [ensureLookup]
  );

  const ensureEducation = useCallback(
    (forceRetry) => {
      ensureLookup("educationCategories", forceRetry);
      ensureLookup("educationSubCategories", forceRetry);
    },
    [ensureLookup]
  );

  // Fetch the job, then eagerly warm every lookup list (all are needed to
  // render the existing selections as chips, not just on dropdown open).
  useEffect(() => {
    let cancelled = false;
    const fetchJob = async () => {
      try {
        setLoading(true);
        const jobData = await fetchJobById(id);
        if (cancelled) return;
        setForm(jobData);
        Object.keys(LOOKUP_CONFIG).forEach((key) => ensureLookup(key));
      } catch (error) {
        console.error("Error fetching job:", error);
        showError("Failed to load job details");
        navigate("/jobs");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (id) fetchJob();
    return () => {
      cancelled = true;
    };
  }, [id, navigate, showError, ensureLookup]);

  const set = (key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const isContract = form?.postingType === "Contract";

  const addQuestion = () =>
    setForm((f) => ({
      ...f,
      questions: [
        ...(f?.questions || []),
        { question: "", question_type: "text", text_placeholder: "", mcq_options: [], is_required: false },
      ],
    }));

  const updateQuestion = (idx, patch) =>
    setForm((f) => ({ ...f, questions: f.questions.map((q, i) => (i === idx ? { ...q, ...patch } : q)) }));

  const removeQuestion = (idx) => setForm((f) => ({ ...f, questions: f.questions.filter((_, i) => i !== idx) }));

  const validate = () => {
    const e = {};
    if (!form?.jobTitle?.trim()) e.jobTitle = "Job title is required";
    if (!form?.jobType) e.jobType = "Select full-time or part-time";

    if (form?.experienceMode === "experienced") {
      if (form.minExperience === "") e.minExperience = "Min experience is required";
      if (form.maxExperience === "") e.maxExperience = "Max experience is required";
      if (form.minExperience !== "" && form.maxExperience !== "" && Number(form.minExperience) > Number(form.maxExperience)) {
        e.maxExperience = "Max experience must be ≥ min experience";
      }
    }

    const plainDescription = form?.jobDescription?.replace(/<[^>]*>/g, "").trim();
    if (!plainDescription) e.jobDescription = "Job description is required";

    if (form?.skills?.length === 0) e.skills = "Select at least one skill";
    if (!form?.workplaceType) e.workplaceType = "Select a workplace type";
    if (form?.locations?.length === 0) e.locations = "Select at least one location";

    if (form?.minSalary === "") e.minSalary = "Min salary is required";
    if (form?.maxSalary === "") e.maxSalary = "Max salary is required";
    if (form?.minSalary !== "" && form?.maxSalary !== "" && Number(form.minSalary) > Number(form.maxSalary)) {
      e.maxSalary = "Max salary must be ≥ min salary";
    }

    if (form?.industryIds?.length === 0 && form?.subIndustryIds?.length === 0) e.industry = "Select an industry";
    if (form?.functionRoles?.length === 0) e.functionRoles = "Select at least one function / role";
    if (form?.educationCategoryIds?.length === 0 && form?.educationSubCategoryIds?.length === 0)
      e.education = "Select an education option";
    if (!form?.folderName?.trim()) e.folderName = "Folder name is required";

    if (!form?.expiryDate) e.expiryDate = "Expiry date is required";
    else if (new Date(form.expiryDate) < new Date(new Date().toDateString())) e.expiryDate = "Expiry date cannot be in the past";

    if (isContract) {
      if (!form?.currency) e.currency = "Select a currency";
      if (!form?.minBillingRate) e.minBillingRate = "Select a min billing rate";
      if (!form?.maxBillingRate) e.maxBillingRate = "Select a max billing rate";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPayload = () => {
    const jobTitle = form?.jobTitle?.trim();
    if (!jobTitle) throw new Error("Job title is required");

    const getIds = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr.filter((v) => v !== null && v !== undefined && !isNaN(Number(v))).map((v) => Number(v));
    };

    const payload = {
      id: Number(id),
      title: jobTitle,
      posting_type: form.postingType || "Permanent",
      job_type_id: form.jobType ? Number(form.jobType) : null,
      expiry_date: form.expiryDate || "",
      reference_code: form.referenceCode?.trim() || null,
      experience_type: form.experienceMode === "fresher" ? "Fresher" : "Experience",
      min_experience: form.experienceMode === "fresher" ? 0 : Number(form.minExperience) || 0,
      max_experience: form.experienceMode === "fresher" ? 0 : Number(form.maxExperience) || 0,
      job_description: form.jobDescription || "",
      auto_renew: form.autoRenew || "off",
      daily_application_summary: form.dailyApplicationSummary || false,
      notify_matching_type: form.individualApplications ? form.notifyMatchingType || "All matching applicants" : "None",
      workplace_type_id: form.workplaceType ? Number(form.workplaceType) : null,
      min_salary: Number(form.minSalary) || 0,
      max_salary: Number(form.maxSalary) || 0,
      salary_confidential: form.salaryConfidential || false,
      folder_name: form.folderName?.trim() || "General",
      prioritize_women: form.prioritizeWomen || false,
      is_status: form.status === "active",
      is_trending: form.isTrending || false,
      skills: getIds(form.skills),
      location_id: getIds(form.locations),
      perks_benefit: getIds(form.perkIds),
      perk_categories: getIds(form.perkCategoryIds),
      industry_id: getIds(form.industryIds),
      sub_industry_id: getIds(form.subIndustryIds),
      function_role_id: getIds(form.functionRoles),
      education_category_id: getIds(form.educationCategoryIds),
      education_sub_category_id: getIds(form.educationSubCategoryIds),
      questions: form.addQuestionnaire
        ? form.questions
            .filter((q) => q.question?.trim())
            .map((q) => ({
              question: q.question.trim(),
              question_type: q.question_type || "text",
              text_placeholder: q.text_placeholder || null,
              mcq_options: q.mcq_options || [],
              is_required: q.is_required || false,
            }))
        : [],
    };

    if (isContract) {
      payload.currency_id = form.currency ? Number(form.currency) : null;
      payload.billing_type = form.billingType || "monthly";
      payload.min_billing_rate_id = form.minBillingRate ? Number(form.minBillingRate) : null;
      payload.max_billing_rate_id = form.maxBillingRate ? Number(form.maxBillingRate) : null;
      payload.billing_rate_confidential = form.billingRateConfidential || false;
      payload.contract_tenure = form.contractTenure?.trim() || null;
    } else {
      payload.currency_id = null;
      payload.billing_type = null;
      payload.min_billing_rate_id = null;
      payload.max_billing_rate_id = null;
      payload.billing_rate_confidential = false;
      payload.contract_tenure = null;
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showError("Please fix the highlighted fields before saving.");
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      await updateJob(payload);
      showSuccess("Job updated successfully!");
      navigate("/jobs");
    } catch (error) {
      console.error("Update error:", error);
      showError(error.message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  const retryAllLookups = () => {
    setLookupWarning(false);
    clearLookupCache();
    requestedRef.current = {};
    Object.keys(LOOKUP_CONFIG).forEach((key) => ensureLookup(key, true));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-500 text-sm">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Job not found</p>
          <button
            onClick={() => navigate("/jobs")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const jobTypeOptions = lookups.jobTypes || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 pb-28 pt-8">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/jobs")}
              className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Edit Job</h1>
              <p className="text-sm text-gray-500">{form.jobTitle || "Untitled job"}</p>
            </div>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
              form.status === "active"
                ? "border-green-200 bg-green-50 text-green-700"
                : form.status === "closed"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-gray-200 bg-gray-50 text-gray-600"
            }`}
          >
            {form.status}
          </span>
        </div>

        {lookupWarning && (
          <div className="mb-5 flex items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <span className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" /> Some dropdowns couldn't load from the live API, so placeholder options are shown.
            </span>
            <button type="button" onClick={retryAllLookups} className="flex items-center gap-1 font-semibold hover:underline">
              <RefreshCw className="h-3.5 w-3.5" /> Retry all
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
          {/* Section nav */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="flex gap-2 overflow-x-auto rounded-2xl border border-purple-100/50 bg-white/80 p-2 shadow-sm lg:flex-col lg:overflow-visible">
              {SECTIONS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => scrollToSection(s.key)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    activeSection === s.key ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md shadow-purple-200" : "text-gray-600 hover:bg-purple-50"
                  }`}
                >
                  <s.icon className="h-4 w-4 shrink-0" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-5">
            {/* Details */}
            <div ref={sectionRefs.details}>
              <GradientSection>
                <h2 className="mb-4 text-sm font-bold text-gray-900">Job details</h2>
                <div className="grid grid-cols-1 gap-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <Field label="Job title" required error={errors.jobTitle}>
                        <input
                          type="text"
                          value={form.jobTitle}
                          onChange={(e) => set("jobTitle")(e.target.value)}
                          placeholder="e.g. Mernstack Developer"
                          className={`${inputBase} ${errors.jobTitle ? inputErr : inputOk}`}
                        />
                      </Field>
                    </div>
                  </div>

                  <Field label="Reference code" hint="Your internal job ID, e.g. JOB123">
                    <input
                      type="text"
                      value={form.referenceCode}
                      onChange={(e) => set("referenceCode")(e.target.value)}
                      placeholder="JOB123"
                      className={`${inputBase} ${inputOk}`}
                    />
                  </Field>

                  <div>
                    <p className="mb-1.5 text-sm font-semibold text-gray-700">Posting type</p>
                    <div className="grid grid-cols-3 gap-2">
                      {POSTING_TYPES.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => set("postingType")(p.id)}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                            form.postingType === p.id ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 bg-white text-gray-600 hover:border-purple-200"
                          }`}
                        >
                          <p.icon className="h-4 w-4" />
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Field label="Employment type" required error={errors.jobType}>
                    <div className="flex flex-wrap gap-2">
                      {lookupLoading.jobTypes ? (
                        <span className="flex items-center gap-2 text-sm text-gray-400">
                          <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                        </span>
                      ) : (
                        jobTypeOptions.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => set("jobType")(opt.id)}
                            className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all ${
                              form.jobType === opt.id ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 bg-white text-gray-600 hover:border-purple-200"
                            }`}
                          >
                            {opt.name}
                          </button>
                        ))
                      )}
                    </div>
                  </Field>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Expiry date" required error={errors.expiryDate}>
                      <div className="relative">
                        <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          value={form.expiryDate}
                          onChange={(e) => set("expiryDate")(e.target.value)}
                          className={`${inputBase} ${errors.expiryDate ? inputErr : inputOk} pl-10`}
                        />
                      </div>
                    </Field>
                    <Field label="Auto renew">
                      <SelectDropdown options={AUTO_RENEW_OPTIONS} value={form.autoRenew} onChange={set("autoRenew")} placeholder="Select auto-renew" />
                    </Field>
                  </div>

                  <div className="rounded-xl border border-purple-100/50 bg-white/60 p-4">
                    <p className="mb-3 text-sm font-semibold text-gray-700">Notify me for</p>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between text-sm text-gray-700">
                        Daily application summary
                        <input
                          type="checkbox"
                          checked={form.dailyApplicationSummary}
                          onChange={(e) => set("dailyApplicationSummary")(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </label>
                      <label className="flex items-center justify-between text-sm text-gray-700">
                        Individual applications
                        <input
                          type="checkbox"
                          checked={form.individualApplications}
                          onChange={(e) => set("individualApplications")(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </label>
                      {form.individualApplications && (
                        <div className="space-y-2 pl-1">
                          {["All matching applicants", "Top matches only"].map((opt) => (
                            <label key={opt} className="flex items-center gap-2 text-sm text-gray-600">
                              <input
                                type="radio"
                                checked={form.notifyMatchingType === opt}
                                onChange={() => set("notifyMatchingType")(opt)}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </GradientSection>
            </div>

            {/* Requirements */}
            <div ref={sectionRefs.requirements}>
              <GradientSection>
                <h2 className="mb-4 text-sm font-bold text-gray-900">Requirements</h2>
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <p className="mb-1.5 text-sm font-semibold text-gray-700">
                      Experience <span className="text-red-500">*</span>
                    </p>
                    <div className="mb-3 inline-flex gap-2">
                      {[{ id: "fresher", name: "Fresher only" }, { id: "experienced", name: "Experienced only" }].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => set("experienceMode")(opt.id)}
                          className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all ${
                            form.experienceMode === opt.id ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 bg-white text-gray-600 hover:border-purple-200"
                          }`}
                        >
                          {opt.name}
                        </button>
                      ))}
                    </div>
                    {form.experienceMode === "experienced" && (
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Min experience (years)" error={errors.minExperience}>
                          <input
                            type="number"
                            min="0"
                            value={form.minExperience}
                            onChange={(e) => set("minExperience")(e.target.value)}
                            className={`${inputBase} ${errors.minExperience ? inputErr : inputOk}`}
                          />
                        </Field>
                        <Field label="Max experience (years)" error={errors.maxExperience}>
                          <input
                            type="number"
                            min="0"
                            value={form.maxExperience}
                            onChange={(e) => set("maxExperience")(e.target.value)}
                            className={`${inputBase} ${errors.maxExperience ? inputErr : inputOk}`}
                          />
                        </Field>
                      </div>
                    )}
                  </div>

                  <Field label="Skills" required error={errors.skills}>
                    <MultiSelectSearch
                      options={lookups.skills}
                      selectedIds={form.skills}
                      onChange={set("skills")}
                      placeholder="Search skills..."
                      loading={lookupLoading.skills}
                      failed={lookupFailed.skills}
                      onOpen={(retry) => ensureLookup("skills", retry)}
                    />
                  </Field>

                  <Field label="Job location" required error={errors.workplaceType || errors.locations}>
                    <div className="flex gap-2">
                      <div className="w-36 shrink-0">
                        <SelectDropdown
                          options={lookups.workplaceTypes}
                          value={form.workplaceType}
                          onChange={set("workplaceType")}
                          placeholder="On-site"
                          error={errors.workplaceType}
                          loading={lookupLoading.workplaceTypes}
                          failed={lookupFailed.workplaceTypes}
                          onOpen={(retry) => ensureLookup("workplaceTypes", retry)}
                        />
                      </div>
                      <div className="flex-1">
                        <MultiSelectSearch
                          options={lookups.locations}
                          selectedIds={form.locations}
                          onChange={set("locations")}
                          placeholder="Select location..."
                          loading={lookupLoading.locations}
                          failed={lookupFailed.locations}
                          onOpen={(retry) => ensureLookup("locations", retry)}
                        />
                      </div>
                    </div>
                  </Field>

                  <Field label="Job description" required error={errors.jobDescription}>
                    <RichTextEditor value={form.jobDescription} onChange={set("jobDescription")} error={errors.jobDescription} />
                  </Field>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-gray-500">This job will prioritize:</span>
                    <input
                      type="checkbox"
                      checked={form.prioritizeWomen}
                      onChange={(e) => set("prioritizeWomen")(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    Women
                  </label>
                </div>
              </GradientSection>
            </div>

            {/* Compensation */}
            <div ref={sectionRefs.compensation}>
              <GradientSection>
                <h2 className="mb-4 text-sm font-bold text-gray-900">Compensation</h2>
                <div className="grid grid-cols-1 gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Min salary (annually)" required error={errors.minSalary}>
                      <div className="relative">
                        <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          min="0"
                          value={form.minSalary}
                          onChange={(e) => set("minSalary")(e.target.value)}
                          className={`${inputBase} ${errors.minSalary ? inputErr : inputOk} pl-10`}
                        />
                      </div>
                    </Field>
                    <Field label="Max salary (annually)" required error={errors.maxSalary}>
                      <div className="relative">
                        <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          min="0"
                          value={form.maxSalary}
                          onChange={(e) => set("maxSalary")(e.target.value)}
                          className={`${inputBase} ${errors.maxSalary ? inputErr : inputOk} pl-10`}
                        />
                      </div>
                    </Field>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.salaryConfidential}
                      onChange={(e) => set("salaryConfidential")(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    Keep salary confidential
                  </label>

                  <Field label="Perks and benefits" hint="Check a category to reveal its perks on the right">
                    <CategoryCheckboxDropdown
                      categories={lookups.perkCategories}
                      subItems={lookups.perks}
                      selectedCategoryIds={form.perkCategoryIds}
                      selectedSubIds={form.perkIds}
                      onChangeCategories={set("perkCategoryIds")}
                      onChangeSubs={set("perkIds")}
                      placeholder="Eg. Cab Services, Paternity leave"
                      loading={lookupLoading.perkCategories || lookupLoading.perks}
                      failed={lookupFailed.perkCategories || lookupFailed.perks}
                      onOpen={(retry) => ensurePerks(retry)}
                    />
                  </Field>

                  {isContract && (
                    <div className="rounded-xl border border-purple-100/50 bg-white/60 p-4">
                      <p className="mb-3 text-sm font-semibold text-gray-700">Contract billing</p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Currency" required error={errors.currency}>
                          <SelectDropdown
                            options={lookups.currencies}
                            value={form.currency}
                            onChange={set("currency")}
                            placeholder="Select currency"
                            error={errors.currency}
                            loading={lookupLoading.currencies}
                            failed={lookupFailed.currencies}
                            onOpen={(retry) => ensureLookup("currencies", retry)}
                          />
                        </Field>
                        <Field label="Billing type">
                          <SelectDropdown options={BILLING_TYPES} value={form.billingType} onChange={set("billingType")} placeholder="Select billing type" />
                        </Field>
                        <Field label="Min billing rate" required error={errors.minBillingRate}>
                          <SelectDropdown
                            options={lookups.billingRates}
                            value={form.minBillingRate}
                            onChange={set("minBillingRate")}
                            placeholder="Select min billing rate"
                            error={errors.minBillingRate}
                            loading={lookupLoading.billingRates}
                            failed={lookupFailed.billingRates}
                            onOpen={(retry) => ensureLookup("billingRates", retry)}
                          />
                        </Field>
                        <Field label="Max billing rate" required error={errors.maxBillingRate}>
                          <SelectDropdown
                            options={lookups.billingRates}
                            value={form.maxBillingRate}
                            onChange={set("maxBillingRate")}
                            placeholder="Select max billing rate"
                            error={errors.maxBillingRate}
                            loading={lookupLoading.billingRates}
                            failed={lookupFailed.billingRates}
                            onOpen={(retry) => ensureLookup("billingRates", retry)}
                          />
                        </Field>
                        <Field label="Contract tenure" hint='e.g. "Upto 6 months"'>
                          <input
                            type="text"
                            value={form.contractTenure}
                            onChange={(e) => set("contractTenure")(e.target.value)}
                            placeholder="Upto 6 months"
                            className={`${inputBase} ${inputOk}`}
                          />
                        </Field>
                        <label className="flex items-center gap-2 self-end pb-3 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={form.billingRateConfidential}
                            onChange={(e) => set("billingRateConfidential")(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          Keep billing rate confidential
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </GradientSection>
            </div>

            {/* Additional */}
            <div ref={sectionRefs.additional}>
              <GradientSection>
                <h2 className="mb-4 text-sm font-bold text-gray-900">Additional details</h2>
                <div className="grid grid-cols-1 gap-5">
                  <Field label="Industry" required error={errors.industry} hint="Check an industry to reveal its sub-industries on the right">
                    <CategoryCheckboxDropdown
                      categories={lookups.industries}
                      subItems={lookups.subIndustries}
                      selectedCategoryIds={form.industryIds}
                      selectedSubIds={form.subIndustryIds}
                      onChangeCategories={set("industryIds")}
                      onChangeSubs={set("subIndustryIds")}
                      placeholder="Select industry"
                      loading={lookupLoading.industries || lookupLoading.subIndustries}
                      failed={lookupFailed.industries || lookupFailed.subIndustries}
                      onOpen={(retry) => ensureIndustry(retry)}
                    />
                  </Field>

                  <Field label="Functions and roles" required error={errors.functionRoles}>
                    <MultiSelectSearch
                      options={lookups.functionRoles}
                      selectedIds={form.functionRoles}
                      onChange={set("functionRoles")}
                      placeholder="Select function and roles..."
                      loading={lookupLoading.functionRoles}
                      failed={lookupFailed.functionRoles}
                      onOpen={(retry) => ensureLookup("functionRoles", retry)}
                    />
                  </Field>

                  <Field label="Education" required error={errors.education} hint="Check a category to reveal its sub-categories on the right">
                    <CategoryCheckboxDropdown
                      categories={lookups.educationCategories}
                      subItems={lookups.educationSubCategories}
                      selectedCategoryIds={form.educationCategoryIds}
                      selectedSubIds={form.educationSubCategoryIds}
                      onChangeCategories={set("educationCategoryIds")}
                      onChangeSubs={set("educationSubCategoryIds")}
                      placeholder="Select education"
                      loading={lookupLoading.educationCategories || lookupLoading.educationSubCategories}
                      failed={lookupFailed.educationCategories || lookupFailed.educationSubCategories}
                      onOpen={(retry) => ensureEducation(retry)}
                    />
                  </Field>

                  <Field label="Folder to save this job" required error={errors.folderName}>
                    <input
                      type="text"
                      value={form.folderName}
                      onChange={(e) => set("folderName")(e.target.value)}
                      placeholder="FullStack Hiring"
                      className={`${inputBase} ${errors.folderName ? inputErr : inputOk}`}
                    />
                  </Field>

                  <div className="rounded-xl border border-purple-100/50 bg-white/60 p-4">
                    <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={form.addQuestionnaire}
                        onChange={(e) => set("addQuestionnaire")(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      Add questionnaire to this job posting
                    </label>

                    {form.addQuestionnaire && (
                      <div className="space-y-3">
                        {form.questions.map((q, idx) => (
                          <div key={idx} className="rounded-lg border border-gray-200 bg-white p-3">
                            <div className="mb-2 flex items-start gap-2">
                              <input
                                type="text"
                                value={q.question}
                                onChange={(e) => updateQuestion(idx, { question: e.target.value })}
                                placeholder="Question text"
                                className={`${inputBase} ${inputOk} flex-1 !py-2`}
                              />
                              <button
                                type="button"
                                onClick={() => removeQuestion(idx)}
                                className="mt-1 shrink-0 rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              <SelectDropdown
                                options={QUESTION_TYPES}
                                value={q.question_type}
                                onChange={(val) => updateQuestion(idx, { question_type: val })}
                                placeholder="Answer type"
                              />
                              <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={q.is_required}
                                  onChange={(e) => updateQuestion(idx, { is_required: e.target.checked })}
                                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                Required
                              </label>
                            </div>
                            {q.question_type === "text" && (
                              <input
                                type="text"
                                value={q.text_placeholder}
                                onChange={(e) => updateQuestion(idx, { text_placeholder: e.target.value })}
                                placeholder="Placeholder text shown to applicant"
                                className={`${inputBase} ${inputOk} mt-3 !py-2`}
                              />
                            )}
                            {q.question_type === "mcq" && (
                              <input
                                type="text"
                                value={q.mcq_options.join(", ")}
                                onChange={(e) =>
                                  updateQuestion(idx, {
                                    mcq_options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                                  })
                                }
                                placeholder="Comma-separated options, e.g. 1 Year, 2 Years, 3+ Years"
                                className={`${inputBase} ${inputOk} mt-3 !py-2`}
                              />
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addQuestion}
                          className="flex items-center gap-1 rounded-lg border border-purple-200 px-3 py-2 text-xs font-semibold text-purple-600 hover:bg-purple-50"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add question
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </GradientSection>
            </div>
          </div>
        </form>
      </div>

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 border-t border-purple-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => navigate("/jobs")}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          {/* <button
            type="button"
            onClick={() => setShowPreview((s) => !s)}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <Eye className="h-4 w-4" /> Preview
          </button> */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-200 transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save changes
              </>
            )}
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowPreview(false)}>
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{form.jobTitle || "Untitled job"}</h3>
              <button onClick={() => setShowPreview(false)} className="rounded-full p-1 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="mb-4 flex flex-wrap gap-2 text-xs text-gray-500">
              <span className="rounded-full bg-gray-100 px-3 py-1">{form.postingType}</span>
              {form.experienceMode === "fresher" ? (
                <span className="rounded-full bg-gray-100 px-3 py-1">Fresher</span>
              ) : (
                <span className="rounded-full bg-gray-100 px-3 py-1">
                  {form.minExperience || 0}–{form.maxExperience || 0} yrs
                </span>
              )}
              {!form.salaryConfidential && (form.minSalary || form.maxSalary) && (
                <span className="rounded-full bg-gray-100 px-3 py-1">
                  ₹{form.minSalary || 0} – ₹{form.maxSalary || 0}
                </span>
              )}
            </div>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: form.jobDescription || "<p class='text-gray-400'>No description yet.</p>" }}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </div>
  );
}