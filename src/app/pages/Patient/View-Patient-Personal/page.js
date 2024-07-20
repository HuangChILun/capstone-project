/**
 * v0 by Vercel.
 * @see https://v0.dev/t/scvpfzBHayp
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Badge } from "@/components/ViewPatientPersonal/ui/badge"
import { Button } from "@/components/ViewPatientPersonal/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ViewPatientPersonal/ui/tabs"
import { Label } from "@/components/ViewPatientPersonal/ui/label"

export default function ViewPatientPersonal() {
  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <ArrowLeftIcon className="w-6 h-6 text-muted-foreground" />
        <Link href="./View-Patient-Page"> 
        <span className="ml-2 text-lg font-semibold text-muted-foreground">Back to Patient List</span>
        </Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h1 className="text-4xl font-bold">Albert Christoff</h1>
          <Badge variant="default" className="ml-4">
            Active
          </Badge>
        </div>
        <Button>Edit</Button>
      </div>
      <Tabs defaultValue="personal-info" className="mb-6">
        <TabsList>
          <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
          <TabsTrigger value="medical-info">Medical Info</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="additional-note">Additional Note</TabsTrigger>
        </TabsList>
        {/* persernal information*/}
        <TabsContent value="personal-info">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
                
              <Label className="text-muted-foreground">First Name</Label>
              <p className="text-lg font-semibold">Albert</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Last Name</Label>
              <p className="text-lg font-semibold">Christoff</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Gender</Label>
              <p className="text-lg font-semibold">Male</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Age</Label>
              <p className="text-lg font-semibold">8</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Address</Label>
              <p className="text-lg font-semibold">1234 Placeholder Hill SE</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Phone Number</Label>
              <p className="text-lg font-semibold">123-456-7890</p>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Primary Guardian</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="text-lg font-semibold">Shiela Christoff</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Relation to Patient</Label>
                <p className="text-lg font-semibold">Parent</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Address</Label>
                <p className="text-lg font-semibold">1234 Placeholder Hill SE</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone Number</Label>
                <p className="text-lg font-semibold">123-456-7890</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="text-lg font-semibold">shiela@gmail.com</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Secondary Guardian</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="text-lg font-semibold">Leonard Christoff</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Relation to Patient</Label>
                <p className="text-lg font-semibold">Parent</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label className="text-muted-foreground">FSCD ID#</Label>
              <p className="text-lg font-semibold">2343345667</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Date Of Birth</Label>
              <p className="text-lg font-semibold">07/08/2013</p>
            </div>
            <div>
              <Label className="text-muted-foreground">School</Label>
              <p className="text-lg font-semibold">Saint Michael's</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Grade</Label>
              <p className="text-lg font-semibold">3</p>
            </div>
            <div>
              <Label className="text-muted-foreground">City</Label>
              <p className="text-lg font-semibold">Calgary</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Province</Label>
              <p className="text-lg font-semibold">Alberta</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Postal Code</Label>
              <p className="text-lg font-semibold">T3R 1A2</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="text-lg font-semibold">albert@gmail.com</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-muted-foreground">Contract</Label>
              <Button variant="outline">Open</Button>
            </div>
            <div>
              <Label className="text-muted-foreground">Consent</Label>
              <Button variant="outline">Open</Button>
            </div>
            <div>
              <Label className="text-muted-foreground">Insurance</Label>
              <Button variant="outline">Open</Button>
            </div>
          </div>
        </div>
      </div>
        </TabsContent>
        {/* medical information here */}
        <TabsContent value="medical-info">
            </TabsContent>
            {/* team here */}
            <TabsContent value="team">
                </TabsContent> 
                {/* additional note here */}
                <TabsContent value="additional-note">

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