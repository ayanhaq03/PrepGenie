"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { PrepGenie } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.interviewId) {
      console.log("params.interviewId:", params.interviewId);
      console.log(`Fetching details for interview ID: ${params.interviewId}`);
      GetInterviewDetails(params.interviewId);
    } else {
      console.error("No interview ID provided in params.");
      setError("No interview ID provided.");
      setLoading(false);
    }
  }, [params.interviewId]);

  const GetInterviewDetails = async (interviewId) => {
    try {
      const result = await db
        .select()
        .from(PrepGenie)
        .where(eq(PrepGenie.mockId, interviewId));

      console.log("Fetch result:", result);

      if (result.length > 0) {
        setInterviewData(result[0]);
        console.log("Fetched interview data:", result[0]);
      } else {
        setError("No interview data found.");
        console.error("No data found for the provided interview ID.");
      }
    } catch (error) {
      setError("Error fetching interview data.");
      console.error("Error fetching interview data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : interviewData ? (
            <>
              <div className="flex flex-col p-5 rounded-lg border gap-5">
                <h2 className="text-lg">
                  <strong>Job Role / Job Position : </strong>
                  {interviewData.jobPosition}
                </h2>
                <h2 className="text-lg">
                  <strong>Job Description / Tech Stack : </strong>
                  {interviewData.jobDesc}
                </h2>
                <h2 className="text-lg">
                  <strong>Years of Experience : </strong>
                  {interviewData.jobExperience}
                </h2>
              </div>
              <div className="p-5 border rounded-lg bg-yellow-100">
                <h2 className="flex gap-2 items-center">
                  <Lightbulb className="text-yellow-500" />
                  <strong>Information :</strong>
                </h2>
                <h2 className="mt-3 text--500">
                  {process.env.NEXT_PUBLIC_INFORMATION}
                </h2>
              </div>
            </>
          ) : (
            <div>No interview data available.</div>
          )}
        </div>

        <div>
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button
                className="w-full"
                variant="gray"
                onClick={() => setWebCamEnabled(true)}
              >
                Enable Web Cam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end items-end">
        <Link href={'/dashboard/interview/'+params.interviewId+ '/start'}>
        <Button  >Start Interview</Button> </Link>
      </div>
    </div>
  );
}

export default Interview;