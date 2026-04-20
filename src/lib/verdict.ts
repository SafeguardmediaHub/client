export function getVerdictLabel(predictedClass?: string) {
  switch ((predictedClass || "").toLowerCase()) {
    case "real":
      return "Likely Real";
    case "synthetic":
      return "AI-Generated";
    case "manipulated":
      return "Manipulated";
    case "deepfake":
      return "Deepfake";
    default:
      return predictedClass || "Unable to Evaluate";
  }
}

export function getVerdictDescription(predictedClass?: string) {
  switch ((predictedClass || "").toLowerCase()) {
    case "real":
      return "This file appears likely authentic based on the current model output.";
    case "synthetic":
      return "This file appears likely AI-generated.";
    case "manipulated":
      return "This file shows signals associated with manipulation or suspicious edits.";
    case "deepfake":
      return "This file shows signals consistent with deepfake content.";
    default:
      return "This file could not be assigned a clear verdict.";
  }
}

export function getVerdictClasses(predictedClass?: string) {
  switch ((predictedClass || "").toLowerCase()) {
    case "real":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "synthetic":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "manipulated":
      return "border-orange-200 bg-orange-50 text-orange-700";
    case "deepfake":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}
