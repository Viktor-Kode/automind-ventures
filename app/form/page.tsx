import { Suspense } from "react";
import { Car } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { VehicleForm } from "../../components/forms/VehicleForm";

export default function FormPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          <Car className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Final details
          </h1>
          <p className="text-xs text-slate-500">
            A few more details to complete your AutoMind registration.
          </p>
        </div>
      </div>
      <Card>
        <Suspense
          fallback={
            <p className="text-sm text-slate-600">
              Loading your details...
            </p>
          }
        >
          <VehicleForm />
        </Suspense>
      </Card>
    </div>
  );
}

