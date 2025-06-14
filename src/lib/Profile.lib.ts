export function getStatusColor(status: string | null) {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "inactive":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "on leave":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
}

export function getEmploymentTypeColor(type: string | null) {
  switch (type?.toLowerCase()) {
    case "full-time":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "part-time":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "contract":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100";
    case "intern":
      return "bg-pink-100 text-pink-800 hover:bg-pink-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
}

export function formatCurrency(amount: number | null) {
  if (!amount) return "Not specified";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | null) {
  if (!dateString) return "Not specified";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getInitials(name: string | null) {
  if (!name) return "UN";
  return name
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
