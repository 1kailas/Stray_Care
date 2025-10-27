import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Shield, Users, Dog, DollarSign } from "lucide-react";
import {
  adoptionsApi,
  volunteersApi,
  donationsApi,
  dogReportsApi,
} from "@/lib/api";

export function Profile() {
  const { user } = useAuthStore();

  // Fetch user's data
  const { data: adoptions = [] } = useQuery({
    queryKey: ["user-adoptions"],
    queryFn: () => adoptionsApi.getAll(),
    enabled: !!user,
  });

  const { data: volunteers = [] } = useQuery({
    queryKey: ["user-volunteers"],
    queryFn: () => volunteersApi.getAll(),
    enabled: !!user,
  });

  const { data: donations = [] } = useQuery({
    queryKey: ["user-donations"],
    queryFn: () => donationsApi.getAll(),
    enabled: !!user,
  });

  const { data: reports = [] } = useQuery({
    queryKey: ["user-reports"],
    queryFn: () => dogReportsApi.getAll(),
    enabled: !!user,
  });

  // Filter user's data
  const myAdoptions = adoptions.filter(
    (a: any) => a.adopterEmail === user?.email,
  );
  const myVolunteerStatus = volunteers.find(
    (v: any) => v.email === user?.email,
  );
  const myDonations = donations.filter(
    (d: any) => d.donorEmail === user?.email,
  );
  const myReports = reports.filter((r: any) => r.reporterEmail === user?.email);

  const totalDonated = myDonations.reduce(
    (sum: number, d: any) => sum + (d.amount || 0),
    0,
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="w-8 h-8 text-primary" />
            My Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and view your activity
          </p>
        </div>
      </div>

      {/* Account Info Card */}
      <Card className="border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Account Information
          </CardTitle>
          <CardDescription>Your account details and role</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="text-lg font-semibold">{user?.name || "Not set"}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="text-lg font-semibold">
                {user?.email || "Not set"}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Shield className="w-4 h-4" />
                Account Role
              </div>
              <Badge
                variant={user?.role === "ADMIN" ? "default" : "secondary"}
                className="text-sm"
              >
                {user?.role || "USER"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Adoption Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myAdoptions.length}</div>
            <p className="text-xs text-muted-foreground">
              {myAdoptions.filter((a: any) => a.status === "PENDING").length}{" "}
              pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Volunteer Status
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myVolunteerStatus ? "1" : "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {myVolunteerStatus?.status || "Not registered"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reports Submitted
            </CardTitle>
            <Dog className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myReports.length}</div>
            <p className="text-xs text-muted-foreground">
              {myReports.filter((r: any) => r.status === "RESCUED").length}{" "}
              rescued
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalDonated.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {myDonations.length} donation{myDonations.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="adoptions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="adoptions">
            My Adoptions ({myAdoptions.length})
          </TabsTrigger>
          <TabsTrigger value="reports">
            My Reports ({myReports.length})
          </TabsTrigger>
          <TabsTrigger value="donations">
            My Donations ({myDonations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="adoptions">
          <Card>
            <CardHeader>
              <CardTitle>Adoption Applications</CardTitle>
              <CardDescription>Track your adoption requests</CardDescription>
            </CardHeader>
            <CardContent>
              {myAdoptions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No adoption requests yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myAdoptions.map((adoption: any) => (
                    <div
                      key={adoption.id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{adoption.dogName}</h4>
                          <Badge
                            variant={
                              adoption.status === "APPROVED"
                                ? "default"
                                : adoption.status === "PENDING"
                                  ? "secondary"
                                  : adoption.status === "COMPLETED"
                                    ? "default"
                                    : "destructive"
                            }
                          >
                            {adoption.status}
                          </Badge>
                        </div>
                        {adoption.applicationDate && (
                          <p className="text-sm text-muted-foreground">
                            Applied:{" "}
                            {new Date(
                              adoption.applicationDate,
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Dog Reports</CardTitle>
              <CardDescription>Reports you've submitted</CardDescription>
            </CardHeader>
            <CardContent>
              {myReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Dog className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No reports submitted yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myReports.map((report: any) => (
                    <div
                      key={report.id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">
                            {report.dogName || "Unnamed Dog"}
                          </h4>
                          <Badge
                            variant={
                              report.status === "RESCUED"
                                ? "default"
                                : report.status === "INVESTIGATING"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {report.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Donation History</CardTitle>
                  <CardDescription>
                    Your contributions to the cause
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {myDonations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No donations yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myDonations.map((donation: any) => (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">
                          ₹{donation.amount?.toLocaleString()}
                        </p>
                        {donation.createdAt && (
                          <p className="text-sm text-muted-foreground">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline">Thank you! 💚</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
