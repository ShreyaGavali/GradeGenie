"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Share2, Edit } from "lucide-react"
import Link from "next/link"
import { FileUpload } from "@/components/file-upload"
import { useRouter, useParams } from "next/navigation"
import { use, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { uploadToCloudinary } from "@/app/utils/uploadToCloudinary"


export default function AssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [assignNameOpen, setAssignNameOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [selectedStudent, setSelectedStudent] = useState("")
  const [manualStudentName, setManualStudentName] = useState("")
  const [activeTab, setActiveTab] = useState("select")
  const { toast } = useToast()
  const [assignment, setAssignment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);


  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assignments/${id}`)  // Use relative URL for local API calls
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setAssignment(data)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchAssignment()
    }
  }, [id])

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload/submissions/${id}`);
        if (!res.ok) throw new Error("Failed to fetch submissions");
        const data = await res.json();
        setSubmissions(data);
      } catch (err) {
        console.error("Failed to fetch submissions", err);
      }
    };

    if (id) {
      fetchSubmissions();
    }
  }, [id]);

  console.log(submissions);


  // Mock data for the assignment
  // const assignment = {
  //   id: params.id,
  //   title: "Essay on Climate Change",
  //   description: "Write a 500-word essay on the impacts of climate change on global ecosystems.",
  //   dueDate: "2023-12-15",
  //   totalPoints: 100,
  //   submissions: [
  //     {
  //       id: "1",
  //       studentName: "John Doe",
  //       studentId: "S12345",
  //       submissionDate: "2023-12-10",
  //       status: "graded",
  //       score: 85,
  //       aiScore: 92,
  //       plagiarismScore: 98,
  //     },
  //     {
  //       id: "2",
  //       studentName: "Jane Smith",
  //       studentId: "S12346",
  //       submissionDate: "2023-12-12",
  //       status: "pending",
  //       score: null,
  //       aiScore: 88,
  //       plagiarismScore: 95,
  //     },
  //     {
  //       id: "3",
  //       studentName: "Bob Johnson",
  //       studentId: "S12347",
  //       submissionDate: "2023-12-14",
  //       status: "graded",
  //       score: 92,
  //       aiScore: 90,
  //       plagiarismScore: 100,
  //     },
  //     {
  //       id: "4",
  //       studentName: null,
  //       studentId: "S12348",
  //       submissionDate: "2023-12-14",
  //       status: "pending",
  //       score: null,
  //       aiScore: 0,
  //       plagiarismScore: 0,
  //     },
  //   ],
  // }

  if (loading) return <p>Loading...</p>
  if (error || !assignment) return <p>Error loading assignment.</p>

  // const handleUploadComplete = (files: File[], images: string[]) => {
  //   console.log("Files uploaded:", files)
  //   console.log("Images captured:", images)
  //   // Here you would typically process the files/images and send them to your backend
  // }

  const handleUploadComplete = async (files: File[], images: string[]) => {
    if (isUploading) return;
    setIsUploading(true);
    try {
      let uploadedUrls: string[] = [];

      const userId = localStorage.getItem('studentID');
      const assignmentId = id;

      if (!userId) {
        throw new Error("Student ID not found. Please login again.");
      }

      // Upload each file to Cloudinary
      for (let file of files) {
        const url = await uploadToCloudinary(file);
        uploadedUrls.push(url);
      }

      console.log("Uploaded URLs:", uploadedUrls);

      // Pick the first uploaded URL (or all if you want multiple)
      const cloudinaryUrl = uploadedUrls[0];

      setUploadedUrl(cloudinaryUrl); // new state


      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload/upload-assignment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cloudinaryUrl,
          userId,
          assignmentId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Assignment uploaded successfully!",
        });
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload assignment.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };



  const handleEditAssignment = () => {
    // Navigate to the edit assignment page with the current assignment data
    router.push(`/dashboard/assignments/${id}/edit`)
  }

  const handleAssignName = () => {
    const studentName = activeTab === "select" ? selectedStudent : manualStudentName

    if (!studentName) {
      toast({
        title: "Error",
        description: "Please select or enter a student name",
        variant: "destructive",
      })
      return
    }

    // Here you would update the submission with the student name
    // This is a placeholder for the actual implementation
    toast({
      title: "Success",
      description: `Submission assigned to ${studentName}`,
    })

    setAssignNameOpen(false)
    setSelectedSubmission(null)
    setSelectedStudent("")
    setManualStudentName("")
  }

  const openAssignNameDialog = (submission) => {
    setSelectedSubmission(submission)
    setAssignNameOpen(true)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{assignment.title}</h1>
          <p className="text-muted-foreground">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <FileUpload
            trigger={<Button>Submit Assignment</Button>}
            title="Submit Assignment"
            description="Upload your completed assignment. You can upload files or take photos."
            onUploadComplete={handleUploadComplete}
          />
          <Button variant="outline" onClick={handleEditAssignment}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Assignment
          </Button>
        </div>
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{assignment.description}</p>
          <p className="mt-2">
            <strong>Total Points:</strong> {assignment.totalPoints}
          </p>
        </CardContent>
       </Card>  */ }

      {/* {assignment.generatedContent && (
  <Card>
    <CardHeader>
      <CardTitle>Generated Assignment Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {assignment.generatedContent.title && (
        <div>
          <h2 className="font-semibold text-lg">Title:</h2>
          <p>{assignment.generatedContent.title}</p>
        </div>
      )}
      {assignment.generatedContent.course && (
        <div>
          <h2 className="font-semibold text-lg">Course:</h2>
          <p>{assignment.generatedContent.course}</p>
        </div>
      )}
      {assignment.generatedContent.dueDate && (
        <div>
          <h2 className="font-semibold text-lg">Due Date:</h2>
          <p>{assignment.generatedContent.dueDate}</p>
        </div>
      )}
      {assignment.generatedContent.description && (
        <div>
          <h2 className="font-semibold text-lg">Description:</h2>
          <p>{assignment.generatedContent.description}</p>
        </div>
      )}
      {assignment.generatedContent.learningObjectives && (
        <div>
          <h2 className="font-semibold text-lg">Learning Objectives:</h2>
          <p>{assignment.generatedContent.learningObjectives}</p>
        </div>
      )}
      {assignment.generatedContent.instructions && (
        <div>
          <h2 className="font-semibold text-lg">Instructions:</h2>
          <p>{assignment.generatedContent.instructions}</p>
        </div>
      )}
      {assignment.generatedContent.questions && (
        <div>
          <h2 className="font-semibold text-lg">Questions:</h2>
          <p className="whitespace-pre-line">{assignment.generatedContent.questions}</p>
        </div>
      )}
    </CardContent>
  </Card>
)}  */}
      {assignment.generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Assignment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignment.generatedContent.title && (
              <div>
                <h2 className="font-semibold text-lg">Title:</h2>
                <p>{assignment.generatedContent.title}</p>
              </div>
            )}
            {assignment.generatedContent.course && (
              <div>
                <h2 className="font-semibold text-lg">Course:</h2>
                <p>{assignment.generatedContent.course}</p>
              </div>
            )}
            {assignment.generatedContent.dueDate && (
              <div>
                <h2 className="font-semibold text-lg">Due Date:</h2>
                <p>{assignment.generatedContent.dueDate}</p>
              </div>
            )}
            {assignment.generatedContent.description && (
              <div>
                <h2 className="font-semibold text-lg">Description:</h2>
                <p>{assignment.generatedContent.description}</p>
              </div>
            )}
            {assignment.generatedContent.learningObjectives && (
              <div>
                <h2 className="font-semibold text-lg">Learning Objectives:</h2>
                <p>{assignment.generatedContent.learningObjectives}</p>
              </div>
            )}
            {assignment.generatedContent.instructions && (
              <div>
                <h2 className="font-semibold text-lg">Instructions:</h2>
                <p>{assignment.generatedContent.instructions}</p>
              </div>
            )}

            {/* Check and render different content types */}
            {assignment.generatedContent.questions && (
              <div>
                <h2 className="font-semibold text-lg">Questions:</h2>
                <p className="whitespace-pre-line">{assignment.generatedContent.questions}</p>
              </div>
            )}

            {/* Render for essay, research papers, short answers, lab reports, etc. */}
            {assignment.generatedContent.contentType && assignment.generatedContent.content && (
              <div>
                <h2 className="font-semibold text-lg">
                  {assignment.generatedContent.contentType.charAt(0).toUpperCase() + assignment.generatedContent.contentType.slice(1)}:
                </h2>
                <p className="whitespace-pre-line">{assignment.generatedContent.content}</p>
              </div>
            )}

            {/* Additional content types handling */}
            {assignment.generatedContent.shortAnswer && (
              <div>
                <h2 className="font-semibold text-lg">Short Answer:</h2>
                <p>{assignment.generatedContent.shortAnswer}</p>
              </div>
            )}
            {assignment.generatedContent.essay && (
              <div>
                <h2 className="font-semibold text-lg">Essay:</h2>
                <p>{assignment.generatedContent.essay}</p>
              </div>
            )}
            {assignment.generatedContent.researchPaper && (
              <div>
                <h2 className="font-semibold text-lg">Research Paper:</h2>
                <p>{assignment.generatedContent.researchPaper}</p>
              </div>
            )}
            {assignment.generatedContent.labReport && (
              <div>
                <h2 className="font-semibold text-lg">Lab Report:</h2>
                <p>{assignment.generatedContent.labReport}</p>
              </div>
            )}
            {assignment.generatedContent.caseStudy && (
              <div>
                <h2 className="font-semibold text-lg">Case Study:</h2>
                <p>{assignment.generatedContent.caseStudy}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}


      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          {/* <CardDescription>{assignment.submissions?.length ?? 0} submissions received</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* {Array.isArray(assignment.submissions) && assignment.submissions.map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                    <AvatarFallback>
                      {submission.studentName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    {submission.studentName ? (
                      <p className="font-medium">{submission.studentName}</p>
                    ) : (
                      <Button
                        variant="link"
                        className="p-0 h-auto font-medium text-blue-500"
                        onClick={() => openAssignNameDialog(submission)}
                      >
                        Assign Student Name
                      </Button>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {submission.status === "graded" ? (
                    <Badge className="bg-green-500">{submission.score}/100</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild title="Share">
                      <Link href={`/dashboard/assignments/${id}/submissions/${submission.id}/share`}>
                        <Share2 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild title="Download">
                      <Link href={`/dashboard/assignments/${id}/submissions/${submission.id}/download`}>
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild title="Review">
                      <Link href={`/dashboard/assignments/${id}/submissions/${submission.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))} */}
            {Array.isArray(submissions) && submissions.map((submission) => (
              <div key={submission._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                    <AvatarFallback>
                      {submission.userId?.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    {submission.userId?.name ? (
                      <p className="font-medium">{submission.userId.name}</p>
                    ) : (
                      <Button
                        variant="link"
                        className="p-0 h-auto font-medium text-blue-500"
                        onClick={() => openAssignNameDialog(submission)}
                      >
                        Assign Student Name
                      </Button>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Submitted: {new Date(submission.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Pending</Badge> {/* If you don't have grading data yet */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild title="Share">
                      <Link href={`/dashboard/assignments/${id}/submissions/${submission._id}/share`}>
                        <Share2 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild title="Download">
                      <Link href={`/dashboard/assignments/${id}/submissions/${submission._id}/download`}>
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild title="Review">
                      <Link href={`/dashboard/assignments/${id}/submissions/${submission._id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </CardContent>
      </Card>
      <Dialog open={assignNameOpen} onOpenChange={setAssignNameOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Student Name</DialogTitle>
            <DialogDescription>
              This submission doesn't have a student name. Please assign a student to it.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="select">Select Student</TabsTrigger>
              <TabsTrigger value="manual">Enter Manually</TabsTrigger>
            </TabsList>

            <TabsContent value="select" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="student-select">Select from class roster</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger id="student-select">
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* This would be populated from your actual student list */}
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="alex-johnson">Alex Johnson</SelectItem>
                    <SelectItem value="sam-wilson">Sam Wilson</SelectItem>
                    <SelectItem value="taylor-brown">Taylor Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="student-name">Enter student name</Label>
                <Input
                  id="student-name"
                  value={manualStudentName}
                  onChange={(e) => setManualStudentName(e.target.value)}
                  placeholder="e.g., John Doe"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button onClick={handleAssignName}>Assign Name</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
