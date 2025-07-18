import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Check, X, Languages } from 'lucide-react';
import { SUPPORTED_LANGUAGES, type Language } from '@/lib/types';

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onSelectionChange: (languages: string[]) => void;
  maxSelections?: number;
  placeholder?: string;
  disabled?: boolean;
  singleSelect?: boolean;
  includeAutoDetect?: boolean;
}

export default function LanguageSelector({
  selectedLanguages,
  onSelectionChange,
  maxSelections = 10,
  placeholder = "Select target languages...",
  disabled = false,
  singleSelect = false,
  includeAutoDetect = false,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('LanguageSelector re-render:', {
      selectedLanguages,
      isOpen,
      searchQuery,
      isAnimating
    });
  }, [selectedLanguages, isOpen, searchQuery, isAnimating]);

  const languageList = useMemo(() => {
    let langs = [...SUPPORTED_LANGUAGES];
    if (includeAutoDetect) {
      langs = [{ code: "auto", name: "Auto-Detect (Recommended)", flag: "🌐" }, ...langs];
    }
    return langs;
  }, [includeAutoDetect]);

  const filteredLanguages = useMemo(() => {
    if (!searchQuery) return languageList;
    return languageList.filter(lang =>
      lang?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang?.code?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, languageList]);

  const selectedLanguageObjects = useMemo(() => {
    const result = selectedLanguages
      .map(code => languageList.find(lang => lang.code === code))
      .filter((lang): lang is Language => Boolean(lang && lang.code && lang.name));
    
    console.log('Selected language objects:', result);
    return result;
  }, [selectedLanguages, languageList]);

  const handleLanguageToggle = (languageCode: string) => {
    console.log('Toggle language:', languageCode);
    
    if (isAnimating) {
      console.log('Animation in progress, ignoring toggle');
      return;
    }

    setIsAnimating(true);
    
    try {
      if (singleSelect) {
        onSelectionChange([languageCode]);
        setIsOpen(false);
      } else {
        if (selectedLanguages.includes(languageCode)) {
          onSelectionChange(selectedLanguages.filter(code => code !== languageCode));
        } else {
          if (selectedLanguages.length < maxSelections) {
            onSelectionChange([...selectedLanguages, languageCode]);
          }
        }
      }
    } catch (error) {
      console.error('Error in handleLanguageToggle:', error);
    } finally {
      // Reset animation flag after a short delay
      setTimeout(() => setIsAnimating(false), 100);
    }
  };

  const removeLanguage = (languageCode: string) => {
    console.log('Remove language:', languageCode);
    
    if (isAnimating) {
      console.log('Animation in progress, ignoring removal');
      return;
    }

    setIsAnimating(true);
    
    try {
      onSelectionChange(selectedLanguages.filter(code => code !== languageCode));
    } catch (error) {
      console.error('Error in removeLanguage:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 100);
    }
  };

  const clearAll = () => {
    console.log('Clear all languages');
    
    if (isAnimating) {
      console.log('Animation in progress, ignoring clear all');
      return;
    }

    setIsAnimating(true);
    
    try {
      onSelectionChange([]);
    } catch (error) {
      console.error('Error in clearAll:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 100);
    }
  };

  return (
    <div className="space-y-3">
      {/* Selected Languages Display - Simplified without animations first */}
      {selectedLanguages.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 glass rounded-xl">
          {selectedLanguageObjects.map((language, index) => {
            if (!language || !language.code || !language.name) {
              console.warn('Invalid language object:', language);
              return null;
            }
            
            return (
              <div key={`${language.code}-${index}`}>
                <Badge 
                  variant="secondary" 
                  className="flex items-center space-x-1 px-3 py-1 glass hover:bg-white/20 transition-colors"
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="font-medium">{language.name}</span>
                  {!singleSelect && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeLanguage(language.code);
                      }}
                      className="h-4 w-4 p-0 ml-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
                    >
                      <X className="h-3 w-3 text-gray-500 hover:text-red-500" />
                    </Button>
                  )}
                </Badge>
              </div>
            );
          })}
          {!singleSelect && selectedLanguages.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-red-500 hover:text-red-700 text-xs px-2 py-1 h-auto"
            >
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Language Selector */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={`glass border-0 w-full justify-between text-left h-auto min-h-[44px] ${
              selectedLanguages.length === 0 ? 'text-gray-500' : ''
            }`}
          >
            <div className="flex items-center space-x-2">
              <Languages className="h-4 w-4" />
              <span>
                {selectedLanguages.length === 0 
                  ? placeholder
                  : singleSelect
                    ? selectedLanguageObjects[0]?.name || placeholder
                    : `${selectedLanguages.length} language${selectedLanguages.length === 1 ? '' : 's'} selected`
                }
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {!singleSelect && selectedLanguages.length < maxSelections && (
                <Badge variant="outline" className="text-xs">
                  {maxSelections - selectedLanguages.length} more
                </Badge>
              )}
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 glass border-0" align="start">
          <Command>
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-3">
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <CommandInput
                placeholder="Search languages..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="flex-1 bg-transparent border-0 py-3 text-sm outline-none placeholder:text-gray-400"
              />
            </div>
            <CommandList>
              <ScrollArea className="h-72">
                <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                  No languages found.
                </CommandEmpty>
                {filteredLanguages
                  .filter(Boolean)
                  .map((language) => {
                    if (!language?.code || !language?.name) {
                      console.warn('Invalid language in filter:', language);
                      return null;
                    }
                    
                    const isSelected = selectedLanguages.includes(language.code);
                    const isDisabled = !isSelected && !singleSelect && selectedLanguages.length >= maxSelections;
                    
                    return (
                      <CommandItem
                        key={language.code}
                        value={language.code}
                        onSelect={() => !isDisabled && handleLanguageToggle(language.code)}
                        className={`flex items-center justify-between px-3 py-3 cursor-pointer ${
                          isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
                        } ${isSelected ? 'bg-primary/10' : ''}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{language.flag}</span>
                          <div>
                            <p className="font-medium">{language.name}</p>
                            <p className="text-xs text-gray-500 uppercase">{language.code}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div>
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </CommandItem>
                    );
                  })}
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}