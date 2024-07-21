
import Link from "next/link"
import { Button } from "@/components/ViewStaffPersonalUi/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ViewStaffPersonalUi/tabs"
import { Badge } from "@/components/ViewStaffPersonalUi/badge"

export default function ViewStaffPersonal() {
  return (
    <div className="p-4">
    <Link href="./View-Staff">
      <div className="flex items-center mb-4">
        <ArrowLeftIcon className="h-6 w-6 mr-2" />
        <span>Back to Staff List</span>
      </div>
      </Link>
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl font-bold">Kevin Huang</div>
        <div className="text-xl ml-2">OT</div>
        <Button className="ml-auto">Edit</Button>
      </div>
      <Tabs defaultValue="personal-info">
        <TabsList>
          <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
          <TabsTrigger value="assigned-patient">Assigned Patient</TabsTrigger>
          <TabsTrigger value="account-access">Account Access</TabsTrigger>
        </TabsList>
        <TabsContent value="personal-info">
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-muted-foreground">First Name</div>
              <div className="text-lg font-bold">Kevin</div>
            </div>
            <div>
              <div className="text-muted-foreground">Last Name</div>
              <div className="text-lg font-bold">Huang</div>
            </div>
            <div>
              <div className="text-muted-foreground">SIN</div>
              <div className="text-lg font-bold">123456789</div>
            </div>
            <div>
              <div className="text-muted-foreground">Rate</div>
              <div className="text-lg font-bold">100</div>
            </div>
            <div>
              <div className="text-muted-foreground">Licensing College</div>
              <div className="text-lg font-bold">Alberta College of Occupational Therapists</div>
            </div>
            <div>
              <div className="text-muted-foreground">Registration Number</div>
              <div className="text-lg font-bold">38564525</div>
            </div>
            <div>
              <div className="text-muted-foreground">Address</div>
              <div className="text-lg font-bold">423 This ST NE</div>
            </div>
            <div>
              <div className="text-muted-foreground">City</div>
              <div className="text-lg font-bold">Calgary</div>
            </div>
            <div>
              <div className="text-muted-foreground">Province</div>
              <div className="text-lg font-bold">Alberta</div>
            </div>
            <div>
              <div className="text-muted-foreground">Postal Code</div>
              <div className="text-lg font-bold">T3R 2B3</div>
            </div>
            <div>
              <div className="text-muted-foreground">Phone Number</div>
              <div className="text-lg font-bold">403-123-8888</div>
            </div>
            <div>
              <div className="text-muted-foreground">Email</div>
              <div className="text-lg font-bold">kevin@gmail.com</div>
            </div>
            <div>
              <div className="text-muted-foreground">Contract</div>
              <Badge variant="default">Open</Badge>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ArrowLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}


function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}