import { useState, useMemo } from 'react';
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
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, languageList]);

  const selectedLanguageObjects = useMemo(() => {
    return selectedLanguages.map(code =>
      languageList.find(lang => lang.code === code)
    ).filter(Boolean) as Language[];
  }, [selectedLanguages, languageList]);

  const handleLanguageToggle = (languageCode: string) => {
    if (singleSelect) {
      onSelectionChange([languageCode]);
    } else {
      if (selectedLanguages.includes(languageCode)) {
        onSelectionChange(selectedLanguages.filter(code => code !== languageCode));
      } else {
        if (selectedLanguages.length < maxSelections) {
          onSelectionChange([...selectedLanguages, languageCode]);
        }
      }
    }
  };

  const removeLanguage = (languageCode: string) => {
    onSelectionChange(selectedLanguages.filter(code => code !== languageCode));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="space-y-3">
      {/* Selected Languages Display */}
      {selectedLanguages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-2 p-3 glass rounded-xl"
        >
          <AnimatePresence>
            {selectedLanguageObjects.map((language, index) => (
              <motion.div
                key={language.code}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
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
                      onClick={() => removeLanguage(language.code)}
                      className="h-4 w-4 p-0 ml-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
                    >
                      <X className="h-3 w-3 text-gray-500 hover:text-red-500" />
                    </Button>
                  )}
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
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
        </motion.div>
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
                    if (!language || !language.code || !language.name) return null;
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
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check className="h-4 w-4 text-primary" />
                          </motion.div>
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
