/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Filter {
    name: string;
    css: string;
}

const FILTERS: Filter[] = [
    { name: 'Original', css: 'none' },
    { name: 'Sepia', css: 'sepia(0.8)' },
    { name: 'Grayscale', css: 'grayscale(1)' },
    { name: 'Vintage', css: 'sepia(0.5) contrast(1.1) brightness(0.9) saturate(1.2)' },
    { name: 'Cold', css: 'contrast(1.1) brightness(1.05) hue-rotate(-15deg)' },
    { name: 'Warm', css: 'sepia(0.3) saturate(1.4) hue-rotate(-10deg) contrast(0.95)' },
];

interface FilterModalProps {
    image: {
        decade: string;
        url: string;
    };
    onClose: () => void;
    onDownload: (decade: string, imageUrl: string, filterCss: string) => Promise<void>;
}

const primaryButtonClasses = "font-permanent-marker text-xl text-center text-black bg-yellow-400 py-3 px-8 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:-rotate-2 hover:bg-yellow-300 shadow-[2px_2px_0px_2px_rgba(0,0,0,0.2)]";
const secondaryButtonClasses = "font-permanent-marker text-xl text-center text-white bg-white/10 backdrop-blur-sm border-2 border-white/80 py-3 px-8 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:rotate-2 hover:bg-white hover:text-black";

const FilterModal: React.FC<FilterModalProps> = ({ image, onClose, onDownload }) => {
    const [selectedFilter, setSelectedFilter] = useState<Filter>(FILTERS[0]);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadClick = async () => {
        setIsDownloading(true);
        try {
            await onDownload(image.decade, image.url, selectedFilter.css);
        } catch (e) {
            console.error("Download failed from modal:", e);
        } finally {
            setIsDownloading(false);
            onClose(); // Close modal after download attempt
        }
    };
    
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
                aria-modal="true"
                role="dialog"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                    className="bg-neutral-900 border border-white/10 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col items-center p-6 gap-6"
                    onClick={(e) => e.stopPropagation()}
                    aria-labelledby="filter-modal-title"
                >
                    <h2 id="filter-modal-title" className="font-caveat text-4xl text-neutral-100">Apply a Filter</h2>
                    
                    {/* Main Content Area */}
                    <div className="flex-1 min-h-0 w-full flex flex-col md:flex-row gap-6 items-center justify-center">
                        {/* Image Preview */}
                        <div className="w-full md:w-1/2 flex items-center justify-center">
                            <img
                                src={image.url}
                                alt={`Preview for ${image.decade} with ${selectedFilter.name} filter`}
                                className="max-w-full max-h-[50vh] object-contain rounded-md transition-all duration-300"
                                style={{ filter: selectedFilter.css }}
                            />
                        </div>
                        
                        {/* Filter Options */}
                        <div className="w-full md:w-1/2 grid grid-cols-3 gap-3" role="group" aria-label="Filter options">
                            {FILTERS.map((filter) => (
                                <button
                                    key={filter.name}
                                    onClick={() => setSelectedFilter(filter)}
                                    className={`aspect-square w-full flex flex-col items-center justify-end p-2 rounded-md transition-all duration-200 focus:outline-none ring-2 ${
                                        selectedFilter.name === filter.name ? 'ring-yellow-400' : 'ring-transparent hover:ring-white/50'
                                    }`}
                                    aria-pressed={selectedFilter.name === filter.name}
                                >
                                    <img
                                        src={image.url}
                                        alt={`${filter.name} filter preview`}
                                        className="w-full h-full object-cover rounded-sm pointer-events-none"
                                        style={{ filter: filter.css }}
                                        aria-hidden="true"
                                    />
                                    <p className="font-permanent-marker text-xs mt-2 text-neutral-200 bg-black/50 px-1 rounded-sm">{filter.name}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mt-4">
                        <button onClick={onClose} className={secondaryButtonClasses}>
                            Cancel
                        </button>
                        <button onClick={handleDownloadClick} disabled={isDownloading} className={`${primaryButtonClasses} disabled:opacity-50 disabled:cursor-not-allowed`}>
                            {isDownloading ? 'Downloading...' : 'Download'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FilterModal;
