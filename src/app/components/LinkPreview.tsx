import React, { useState } from 'react';

interface LinkPreviewProps {
  url: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;  // Optional onClick prop
}

interface PreviewData {
  title: string;
  description: string;
  image: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url, children, onClick }) => {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const API_KEY=process.env.LINK_PREVIEW_KEY as string

  const fetchPreviewData = async () => {
    if (isError || loading) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`https://api.linkpreview.net/?q=${encodeURIComponent(url)}`, {
        headers: {
          'X-Linkpreview-Api-Key': API_KEY,
        },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      if (data.title && data.description) {
        setPreviewData(data);
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
      setPreviewData(null);
    } finally {
      setLoading(false);
    }
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-48 bg-gray-200 rounded mb-2"></div>
      <div className="h-16 w-24 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="relative inline-block">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-blue-600 transition-colors duration-200"
        onMouseEnter={fetchPreviewData}
        {...(onClick && { onClick })}  // Only add onClick if it's provided
      >
        {children}
      </a>

      {!isError && (
        <div className="absolute z-50 mt-2 -right-2 transform-gpu transition-all duration-200 origin-top-right">
          <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
            <div className="w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 text-sm">
              {loading ? (
                <LoadingSkeleton />
              ) : previewData && (
                <div className="space-y-2">
                  <div className="font-medium">{previewData.title}</div>
                  <p className="text-gray-600 text-xs">{previewData.description}</p>
                  {previewData.image && (
                    <img
                      src={previewData.image}
                      alt={previewData.title}
                      className="w-full rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkPreview;