import { Slider } from "@/components/ui/slider";

interface PriceRangeSliderProps {
  values: [number, number];
  onChange: (...event: any[]) => void;
}

export function PriceRangeSlider({ values, onChange }: PriceRangeSliderProps) {
  const handleValueChange = (newValues: number[]) => {
    if (newValues.length !== 2) return;
    const sortedValues = [...newValues].sort((a, b) => a - b) as [
      number,
      number
    ];
    onChange(sortedValues);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Slider
          value={values}
          min={0}
          max={50}
          onValueChange={handleValueChange}
          className="py-4 "
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="rounded-md border px-3 py-2">
          <div className="text-xs text-muted-foreground">Min</div>
          <div className="font-medium">{`€${values[0]}`}</div>
        </div>
        <div className="rounded-md border px-3 py-2">
          <div className="text-xs text-muted-foreground">Max</div>
          <div className="font-medium">{`€${values[1]}`}</div>
        </div>
      </div>
    </div>
  );
}
