import { X } from 'lucide-react';
import { type KeyboardEvent, useRef, useState } from 'react';

interface TagInputProps {
  tags: string[];
  placeholder?: string;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}

export const TagInput = ({ tags, placeholder = 'Enter tag', onAdd, onRemove }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || tags.includes(trimmed)) {
      setInputValue('');
      return;
    }
    onAdd(trimmed);
    setInputValue('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '4px',
        minHeight: '36px',
        border: `1px solid ${focused ? '#007AFF' : '#c7c7cc'}`,
        borderRadius: '6px',
        padding: '4px 8px',
        cursor: 'text',
        backgroundColor: '#ffffff',
        boxShadow: focused ? '0 0 0 3px rgba(0,122,255,0.15)' : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#28A745',
            border: 'none',
            borderRadius: '999px',
            padding: '3px 10px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#ffffff',
            flexShrink: 0,
            lineHeight: '1.5',
            letterSpacing: '0.01em',
          }}
        >
          {tag}
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.85)',
              padding: 0,
              marginLeft: '2px',
              lineHeight: 1,
            }}
            onClick={(e) => { e.stopPropagation(); onRemove(tag); }}
            aria-label={`${tag} を削除`}
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        style={{
          flex: 1,
          minWidth: '100px',
          border: 'none',
          outline: 'none',
          fontSize: '13px',
          background: 'transparent',
          color: '#000000',
        }}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};
