"use client";

import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircleIcon } from "lucide-react";
import { db } from "@/utils/db";
import { PrepGenie } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDailog, setOpenDailog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [JsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience);

    const InputPrompt =
      "Job position : " +
      jobPosition +
      " , job Description : " +
      jobDesc +
      " , Years of experience : " +
      jobExperience +
      " , please provide me " +
      process.env.NEXT_PUBLIC_iNTERVIEW_QUESTION_COUNT +
      " interview question along with answer in JSON format depend on job position , job description and years of experience ,give us question and answer field on json.";

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const MockJsonResp = await result.response.text();
      const cleanedMockJsonResp = MockJsonResp
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim(); // Remove any leading or trailing whitespace

      console.log("Cleaned JSON response:", cleanedMockJsonResp);

      const parsedJson = JSON.parse(cleanedMockJsonResp);
      setJsonResponse(parsedJson);

      if (parsedJson) {
        const resp = await db
          .insert(PrepGenie) // PrepGenie is schema name
          .values({
            mockId: uuidv4(),
            jsonMockResp: cleanedMockJsonResp,
            jobPosition: jobPosition,
            jobDesc: jobDesc,
            jobExperience: jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-yyyy"),
          })
          .returning({ mockId: PrepGenie.mockId });

        console.log("Inserted ID: ", resp);
        if (resp) {
          setOpenDailog(false);
          router.push("/dashboard/interview/" + resp[0]?.mockId);
        }
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error("Error parsing JSON response:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDailog(true)}
      >
        <h2 className="text-lg text-center">+Add New</h2>
      </div>
      <Dialog open={openDailog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job Interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add Details about your job position/role,Job description and
                    Years of experience{" "}
                  </h2>

                  <div className="mt-7 my-2">
                    <label>Job Role/Job Position</label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      required
                      onChange={(event) => setJobPosition(event.target.value)}
                    ></Input>
                  </div>
                  <div className=" my-3">
                    <label>Job Description/ Tech Stack (In Short)</label>
                    <Textarea
                      placeholder="Ex. React , Angular, Node.js, My SQL etc."
                      required
                      onChange={(event) => setJobDesc(event.target.value)}
                    ></Textarea>
                  </div>
                  <div className=" my-3">
                    <label>Years of Experience</label>
                    <Input
                      placeholder="Ex. 5"
                      type="number"
                      max="50"
                      required
                      onChange={(event) => setJobExperience(event.target.value)}
                    ></Input>
                  </div>
                </div>

                <div className="flex gap-5 justify-end mt-5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDailog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircleIcon className="animate-spin" />{" "}
                        'Generating from AI'
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;