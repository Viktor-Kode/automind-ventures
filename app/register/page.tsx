import { RegisterForm } from "../../components/forms/RegisterForm";
import { Card } from "../../components/ui/Card";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Create your AutoMind profile
          </h1>
          <p className="text-xs text-slate-500">
            Tell us who you are and how we can reach you.
          </p>
        </div>
      </div>
      <Card>
        <RegisterForm />
      </Card>
    </div>
  );
}

