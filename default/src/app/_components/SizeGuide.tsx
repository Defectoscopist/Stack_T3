"use client";

import { X } from "lucide-react";

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-auto p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5 text-neutral-600" />
        </button>
        <h3 className="text-xl font-bold text-neutral-900 mb-6">Size Guide</h3>
        <div className="space-y-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-neutral-200">
                <th className="text-left py-3 px-3 font-semibold text-neutral-900">Size</th>
                <th className="text-left py-3 px-3 font-semibold text-neutral-900">Chest (in)</th>
                <th className="text-left py-3 px-3 font-semibold text-neutral-900">Length (in)</th>
                <th className="text-left py-3 px-3 font-semibold text-neutral-900">Shoulder (in)</th>
              </tr>
            </thead>
            <tbody className="text-neutral-600">
              <tr className="border-b border-neutral-100">
                <td className="py-3 px-3 font-medium text-neutral-900">XS</td>
                <td className="py-3 px-3">34-36</td>
                <td className="py-3 px-3">26</td>
                <td className="py-3 px-3">16</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-3 px-3 font-medium text-neutral-900">S</td>
                <td className="py-3 px-3">36-38</td>
                <td className="py-3 px-3">27</td>
                <td className="py-3 px-3">17</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-3 px-3 font-medium text-neutral-900">M</td>
                <td className="py-3 px-3">38-40</td>
                <td className="py-3 px-3">28</td>
                <td className="py-3 px-3">18</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-3 px-3 font-medium text-neutral-900">L</td>
                <td className="py-3 px-3">40-42</td>
                <td className="py-3 px-3">29</td>
                <td className="py-3 px-3">19</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-3 px-3 font-medium text-neutral-900">XL</td>
                <td className="py-3 px-3">42-44</td>
                <td className="py-3 px-3">30</td>
                <td className="py-3 px-3">20</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-neutral-900">XXL</td>
                <td className="py-3 px-3">44-46</td>
                <td className="py-3 px-3">31</td>
                <td className="py-3 px-3">21</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
            <p className="text-sm text-neutral-600">
              <strong className="text-neutral-900">How to measure:</strong> Measure your chest at the fullest part, length from the top of the shoulder to the hem, and shoulder width from edge to edge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}