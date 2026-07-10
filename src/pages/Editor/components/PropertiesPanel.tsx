import { useState } from "react";
import { ImageOff, Plus, X } from "lucide-react";
import { usePropertiesStore, type TraitInfo } from "../stores/propertiesStore";

function ImageField() {
  const imageSrc = usePropertiesStore((state) => state.imageSrc);
  const setImageSrc = usePropertiesStore((state) => state.setImageSrc);
  const openAssetManager = usePropertiesStore(
    (state) => state.openAssetManager,
  );

  return (
    <div className="mb-3 px-2">
      <span className="mb-1 block text-sm text-gray-700">Image</span>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border border-gray-200 bg-gray-50">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageOff className="h-4 w-4 text-gray-300" />
          )}
        </div>
        <button
          type="button"
          onClick={openAssetManager}
          className="flex-1 rounded border border-gray-200 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          Select image
        </button>
      </div>
      <input
        type="text"
        value={imageSrc}
        onChange={(e) => setImageSrc(e.target.value)}
        className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm text-gray-700"
      />
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        checked ? "bg-primary-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function TraitField({ trait }: { trait: TraitInfo }) {
  const setTraitValue = usePropertiesStore((state) => state.setTraitValue);

  if (trait.type === "checkbox") {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{trait.label}</span>
        <ToggleSwitch
          checked={trait.value === "true" || trait.value === "1"}
          onChange={(checked) =>
            setTraitValue(trait.name, checked ? "true" : "")
          }
        />
      </div>
    );
  }

  if (trait.type === "select") {
    return (
      <label className="block">
        <span className="mb-1 block text-sm text-gray-700">
          {trait.label}
        </span>
        <select
          value={trait.value}
          onChange={(e) => setTraitValue(trait.name, e.target.value)}
          className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm text-gray-700"
        >
          {trait.options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (trait.type === "color") {
    return (
      <label className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{trait.label}</span>
        <input
          type="color"
          value={trait.value || "#000000"}
          onChange={(e) => setTraitValue(trait.name, e.target.value)}
          className="h-7 w-10 rounded border border-gray-200"
        />
      </label>
    );
  }

  return (
    <label className="block">
      <span className="mb-1 block text-sm text-gray-700">{trait.label}</span>
      <input
        type={trait.type === "number" ? "number" : "text"}
        value={trait.value}
        onChange={(e) => setTraitValue(trait.name, e.target.value)}
        className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm text-gray-700"
      />
    </label>
  );
}

function CustomAttributes() {
  const customAttributes = usePropertiesStore(
    (state) => state.customAttributes,
  );
  const addCustomAttribute = usePropertiesStore(
    (state) => state.addCustomAttribute,
  );
  const removeCustomAttribute = usePropertiesStore(
    (state) => state.removeCustomAttribute,
  );
  const [adding, setAdding] = useState(false);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (key.trim()) {
      addCustomAttribute(key, value);
      setKey("");
      setValue("");
      setAdding(false);
    }
  };

  return (
    <div className="px-2">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-gray-700">Custom Attributes</span>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="rounded border border-gray-200 p-1 text-gray-500 hover:bg-gray-100"
          aria-label="Add attribute"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {adding && (
        <div className="mb-2 flex items-center gap-1">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="name"
            className="min-w-0 flex-1 rounded border border-gray-200 px-2 py-1 text-xs text-gray-700"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="value"
            className="min-w-0 flex-1 rounded border border-gray-200 px-2 py-1 text-xs text-gray-700"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded bg-primary-600 px-2 py-1 text-xs text-white hover:bg-primary-700"
          >
            Add
          </button>
        </div>
      )}

      <div className="space-y-1">
        {customAttributes.map((attr) => (
          <div key={attr.key} className="flex items-center gap-2">
            <span className="w-24 shrink-0 truncate text-xs text-gray-500">
              {attr.key}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs text-gray-700">
              {attr.value}
            </span>
            <button
              type="button"
              onClick={() => removeCustomAttribute(attr.key)}
              className="text-gray-400 hover:text-gray-700"
              aria-label={`Remove ${attr.key}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PropertiesPanel() {
  const traits = usePropertiesStore((state) => state.traits);
  const isImageComponent = usePropertiesStore(
    (state) => state.isImageComponent,
  );

  return (
    <div>
      <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Properties
      </h2>

      {isImageComponent && <ImageField />}

      <div className="mb-3 space-y-3 px-2">
        {traits.map((trait) => (
          <TraitField key={trait.name} trait={trait} />
        ))}
      </div>

      <CustomAttributes />
    </div>
  );
}
