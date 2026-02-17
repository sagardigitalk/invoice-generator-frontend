import React from 'react';

interface Props {
  template: 'classic' | 'modern' | 'minimal' | 'professional';
}

export function TemplatePreview({ template }: Props) {
  const previews = {
    classic: (
      <div className="w-full h-32 border-2 border-gray-300 rounded p-2 bg-white">
        <div className="border-b-2 border-black pb-1 mb-1">
          <div className="h-2 bg-gray-800 w-1/2 mx-auto mb-1"></div>
          <div className="h-1 bg-gray-400 w-3/4 mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 gap-1 mb-1">
          <div className="border border-black p-1">
            <div className="h-1 bg-gray-400 w-full mb-0.5"></div>
            <div className="h-1 bg-gray-300 w-4/5"></div>
          </div>
          <div className="border border-black p-1">
            <div className="h-1 bg-gray-400 w-full mb-0.5"></div>
            <div className="h-1 bg-gray-300 w-3/4"></div>
          </div>
        </div>
        <div className="border border-black p-1">
          <div className="grid grid-cols-4 gap-0.5">
            <div className="h-1 bg-gray-200"></div>
            <div className="h-1 bg-gray-200"></div>
            <div className="h-1 bg-gray-200"></div>
            <div className="h-1 bg-gray-200"></div>
          </div>
        </div>
      </div>
    ),
    modern: (
      <div className="w-full h-32 border border-gray-300 rounded overflow-hidden bg-white">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-8 p-1 flex justify-between items-center">
          <div className="h-1.5 bg-white w-1/3 opacity-90"></div>
          <div className="h-1 bg-white w-1/6 opacity-90"></div>
        </div>
        <div className="p-2">
          <div className="grid grid-cols-2 gap-1 mb-1">
            <div className="bg-gray-100 p-1">
              <div className="h-1 bg-gray-400 w-full mb-0.5"></div>
              <div className="h-1 bg-gray-300 w-4/5"></div>
            </div>
            <div className="bg-gray-100 p-1">
              <div className="h-1 bg-gray-400 w-full mb-0.5"></div>
              <div className="h-1 bg-gray-300 w-3/4"></div>
            </div>
          </div>
          <div className="bg-blue-600 h-1.5 mb-1"></div>
          <div className="space-y-0.5">
            <div className="h-1 bg-gray-100"></div>
            <div className="h-1 bg-gray-50"></div>
          </div>
        </div>
      </div>
    ),
    minimal: (
      <div className="w-full h-32 border border-gray-300 rounded p-2 bg-white">
        <div className="flex justify-between mb-2 pb-1 border-b border-gray-300">
          <div className="h-2 bg-gray-800 w-1/3"></div>
          <div className="h-1.5 bg-gray-300 w-1/6"></div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div>
            <div className="h-0.5 bg-gray-400 w-2/3 mb-1"></div>
            <div className="h-1 bg-gray-200 w-full mb-0.5"></div>
            <div className="h-0.5 bg-gray-200 w-4/5"></div>
          </div>
          <div>
            <div className="h-0.5 bg-gray-400 w-2/3 mb-1"></div>
            <div className="h-0.5 bg-gray-200 w-full"></div>
          </div>
          <div>
            <div className="h-0.5 bg-gray-400 w-2/3 mb-1"></div>
            <div className="h-0.5 bg-gray-200 w-full"></div>
          </div>
        </div>
        <div className="border-b-2 border-gray-900 mb-1"></div>
        <div className="space-y-0.5">
          <div className="h-0.5 bg-gray-100"></div>
          <div className="h-0.5 bg-gray-50"></div>
        </div>
      </div>
    ),
    professional: (
      <div className="w-full h-32 border-4 border-gray-800 rounded p-2 bg-white">
        <div className="flex justify-between mb-1">
          <div className="bg-gray-800 px-2 py-1 w-1/2">
            <div className="h-1 bg-white w-full"></div>
          </div>
          <div className="bg-gray-800 px-2 py-1 w-1/3">
            <div className="h-1 bg-white w-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1 mb-1">
          <div className="border-2 border-gray-300 p-1">
            <div className="bg-gray-800 h-1 -mx-1 -mt-1 mb-1"></div>
            <div className="h-0.5 bg-gray-300 w-full mb-0.5"></div>
            <div className="h-0.5 bg-gray-200 w-4/5"></div>
          </div>
          <div className="border-2 border-gray-300 p-1">
            <div className="bg-gray-800 h-1 -mx-1 -mt-1 mb-1"></div>
            <div className="h-0.5 bg-gray-300 w-full mb-0.5"></div>
            <div className="h-0.5 bg-gray-200 w-3/4"></div>
          </div>
        </div>
        <div className="border-2 border-gray-300">
          <div className="bg-gray-800 h-1.5"></div>
          <div className="p-0.5 space-y-0.5">
            <div className="h-0.5 bg-gray-100"></div>
            <div className="h-0.5 bg-gray-50"></div>
          </div>
        </div>
      </div>
    ),
  };

  return previews[template];
}
