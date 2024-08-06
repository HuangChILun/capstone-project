
import Link from "next/link"
import { Button } from "@/app/pages/Account/View-Profile/button"

export function profile() {
  return (
    (<div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 border-r">
        <div className="flex items-center justify-center h-16 bg-primary text-white">
          <span className="text-lg font-bold">Bridging Abilities</span>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            href="#"
            className="block py-2 text-gray-700 hover:bg-gray-200 rounded"
            prefetch={false}>
            Home Page
          </Link>
          <div>
            <button
              className="flex items-center justify-between w-full py-2 text-gray-700 hover:bg-gray-200 rounded">
              Patient
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            <div className="pl-4 space-y-1">
              <Link
                href="#"
                className="block py-1 text-gray-700 hover:bg-gray-200 rounded"
                prefetch={false}>
                Submenu 1
              </Link>
              <Link
                href="#"
                className="block py-1 text-gray-700 hover:bg-gray-200 rounded"
                prefetch={false}>
                Submenu 2
              </Link>
            </div>
          </div>
          <div>
            <button
              className="flex items-center justify-between w-full py-2 text-gray-700 hover:bg-gray-200 rounded">
              Schedule
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            <div className="pl-4 space-y-1">
              <Link
                href="#"
                className="block py-1 text-gray-700 hover:bg-gray-200 rounded"
                prefetch={false}>
                Submenu 1
              </Link>
              <Link
                href="#"
                className="block py-1 text-gray-700 hover:bg-gray-200 rounded"
                prefetch={false}>
                Submenu 2
              </Link>
            </div>
          </div>
          <div>
            <button
              className="flex items-center justify-between w-full py-2 text-gray-700 hover:bg-gray-200 rounded">
              Invoice
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            <div className="pl-4 space-y-1">
              <Link
                href="#"
                className="block py-1 text-gray-700 hover:bg-gray-200 rounded"
                prefetch={false}>
                Submenu 1
              </Link>
              <Link
                href="#"
                className="block py-1 text-gray-700 hover:bg-gray-200 rounded"
                prefetch={false}>
                Submenu 2
              </Link>
            </div>
          </div>
          <div>
            <button
              className="flex items-center justify-between w-full py-2 text-gray-700 hover:bg-gray-200 rounded">
              Staff Management
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            <div className="pl-4 space-y-1">
              <Link
                href="#"
                className="block py-1 text-gray-700 hover:bg-gray-200 rounded"
                prefetch={false}>
                Submenu 1
              </Link>
              <Link
                href="#"
                className="block py-1 text-gray-700 hover:bg-gray-200 rounded"
                prefetch={false}>
                Submenu 2
              </Link>
            </div>
          </div>
          <div>
            <button
              className="flex items-center justify-between w-full py-2 text-gray-700 hover:bg-gray-200 rounded">
              Account
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            <div className="pl-4 space-y-1">
              <Link
                href="#"
                className="block py-1 text-gray-700 hover:bg-gray-200 rounded bg-blue-100"
                prefetch={false}>
                View Profile
              </Link>
              <Link
                href="#"
                className="block py-1 text-gray-700 hover:bg-gray-200 rounded"
                prefetch={false}>
                Password Change
              </Link>
            </div>
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary">John Doe</h1>
            <p className="text-muted-foreground">Administrator</p>
          </div>
          <Button className="bg-blue-500 text-white">Edit</Button>
        </div>
        <div className="border p-8 rounded-lg">
          <div className="flex items-center mb-8">
            <div
              className="relative w-32 h-32 border rounded-full flex items-center justify-center">
              <UserIcon className="w-16 h-16 text-muted-foreground" />
              <FilePenIcon className="absolute top-0 right-0 w-6 h-6 text-muted-foreground" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-semibold">First Name</p>
              <p>John</p>
            </div>
            <div>
              <p className="font-semibold">Last Name</p>
              <p>Doe</p>
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p>john@gmail.com</p>
            </div>
            <div>
              <p className="font-semibold">Phone Number</p>
              <p>123-456-7890</p>
            </div>
            <div>
              <p className="font-semibold">Address</p>
              <p>1234 Placeholder Hill SE</p>
            </div>
            <div>
              <p className="font-semibold">City</p>
              <p>Calgary</p>
            </div>
            <div>
              <p className="font-semibold">Postal Code</p>
              <p>T3R 1A2</p>
            </div>
            <div>
              <p className="font-semibold">Province</p>
              <p>Alberta</p>
            </div>
            <div>
              <p className="font-semibold">Role</p>
              <p>Administrator</p>
            </div>
          </div>
        </div>
      </main>
    </div>)
  );
}

function ChevronDownIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>)
  );
}


function FilePenIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>)
  );
}


function UserIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>)
  );
}
