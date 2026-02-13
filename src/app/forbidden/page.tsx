export default function ForbiddenPage() {
  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <h1 className="text-3xl font-bold">403 - Forbidden</h1>
      <p className="text-gray-500 mt-2">
        You don’t have permission to access this resource.
      </p>
    </div>
  );
}
