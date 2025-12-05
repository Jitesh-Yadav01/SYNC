import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function KnowMore({ open = false, onClose = () => {}, club = {} }) {
  if (!open) return null

  return (
    <div className="fixed z-[9999] left-0 right-0 flex justify-center bg-black/50">
  <div className="relative w-[95%] max-w-[920px] h-120 overflow-y-auto rounded-xl bg-white p-5 shadow-[0_10px_40px_rgba(2,6,23,0.3)]">
    <button
      onClick={onClose}
      aria-label="Close"
      className="absolute right-2.5 top-2.5 h-9 w-9 cursor-pointer rounded-lg border-none bg-gray-200 text-lg leading-9"
    >
      ×
    </button>
    
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
</div>
  )
}