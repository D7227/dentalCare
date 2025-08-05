import React from 'react';
import { Check, RotateCcw, Wrench, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { OrderCategory } from './types/orderTypes';

interface OrderCategoryStepProps {
  onCategorySelect: (category: OrderCategory) => void;
}

const OrderCategoryStep = ({ onCategorySelect }: OrderCategoryStepProps) => {
  const categories = [
    {
      id: 'new' as const,
      icon: <Check size={20} className="text-white" />,
      title: 'New Order',
      description: ['Place a completely new lab', 'request'],
      gradient: 'from-emerald-500 to-teal-600',
      hoverGradient: 'hover:from-emerald-600 hover:to-teal-700',
      bgAccent: 'bg-emerald-50',
      borderAccent: 'border-customPrimery-20',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      cardBg: 'linear-gradient(122deg, rgba(255, 255, 255, 0.20) 35.88%, rgba(11, 128, 67, 0.10) 158.59%)'
    },
    {
      id: 'repeat' as const,
      icon: <RotateCcw size={20} className="text-white" />,
      title: 'Repeat Order',
      description: ['Reorder based on a', 'previous case'],
      gradient: 'from-blue-500 to-indigo-600',
      hoverGradient: 'hover:from-blue-600 hover:to-indigo-700',
      bgAccent: 'bg-blue-50',
      borderAccent: 'border-customBlue-100',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      cardBg: ' linear-gradient(122deg, rgba(255, 255, 255, 0.20) 35.33%, rgba(29, 78, 216, 0.15) 144.54%)'
    },
    {
      id: 'repair' as const,
      icon: <Wrench size={20} className="text-white" />,
      title: 'Repair',
      description: ['Submit a case for', 'fixing/adjustment'],
      gradient: 'from-orange-500 to-red-500',
      hoverGradient: 'hover:from-orange-600 hover:to-red-600',
      bgAccent: 'bg-orange-50',
      borderAccent: 'border-customOrange-15',
      iconBg: 'bg-gradient-to-br from-orange-500 to-red-500',
      cardBg: 'linear-gradient(120deg, rgba(255, 255, 255, 0.20) 36.18%, rgba(234, 88, 12, 0.15) 145.91%)'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Check size={16} className="text-white" />
          </div>
        </div>
        <h2 className="text-20/28 font-semibold text-customBlack-100">
          What type of order would you like to place?
        </h2>
        <p className="text-14/20 text-customGray-100 font-medium max-w-xl mx-auto !mt-0">
          Choose the category that best matches your dental lab <br /> requirements
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`group cursor-pointer transition-all duration-300 border-2 hover:border-transparent hover:shadow-lg hover:-translate-y-1 ${category.borderAccent} overflow-hidden relative`}
            onClick={() => onCategorySelect(category.id)}
            style={{
              background: category?.cardBg,
              border: category?.borderAccent,
            }}
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${category?.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

            <CardContent className="p-4 text-center relative z-10">
              {/* Icon Container */}
              <div className="relative mb-4 mt-[38.5px]">
                <div className={`inline-flex p-3 rounded-lg ${category?.iconBg} shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300`}>
                  {category?.icon}
                </div>
                {/* Floating accent */}
                {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100"></div> */}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                  {category?.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {Array.isArray(category?.description)
                    ? <>{category?.description[0]}<br />{category?.description[1]}</>
                    : category?.description}
                </p>

                {/* Call to action */}
                <div className="pt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-gray-700">
                    Select this option
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card className="border-customGray-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-1.5 mb-2">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 mt-1.5"></div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gray-900">
                Need help choosing the right option?
              </h4>

            </div>
          </div>
          <div className="space-y-1.5 text-xs text-gray-700 ml-0.5">
            <p className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0"></span>
              <span><strong>New Order:</strong> Perfect for first-time requests or completely new dental work</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-blue-500 flex-shrink-0"></span>
              <span><strong>Repeat Order:</strong> Ideal when you want to duplicate a previous successful case</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-orange-500 flex-shrink-0"></span>
              <span><strong>Repair:</strong> Use this when existing dental work needs adjustments or fixes</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderCategoryStep;
