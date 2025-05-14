"use client"

import { useState } from "react"
import { Languages, HelpCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface LanguageDetectionDialogProps {
  open: boolean
  onClose: () => void
  isProcessing: boolean
  processingProgress: number
  detectedLanguage: "english" | "hebrew" | "unknown"
  selectedLanguage: "english" | "hebrew"
  onLanguageChange: (language: "english" | "hebrew") => void
  onConfirm: () => void
  showLanguageSelection?: boolean
}

const LanguageDetectionDialog = ({
  open,
  onClose,
  isProcessing,
  processingProgress,
  detectedLanguage,
  selectedLanguage,
  onLanguageChange,
  onConfirm,
  showLanguageSelection = false,
}: LanguageDetectionDialogProps) => {
  const [chooseLang, setChooseLang] = useState(showLanguageSelection)

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isProcessing && processingProgress < 100 ? "Processing Document" : "Upload Exam"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {isProcessing && processingProgress < 100 ? (
            <>
              <p className="text-center text-sm text-gray-600">Analyzing document and detecting language...</p>
              <Progress value={processingProgress} className="h-2" />
              <p className="text-center text-xs text-gray-500">{processingProgress}% complete</p>
            </>
          ) : (
            <div className="text-center mt-4 space-y-2">
              {detectedLanguage !== "unknown" && (
                <p className="text-sm text-gray-700">
                  Language detected:{" "}
                  <span className="font-semibold">{detectedLanguage === "english" ? "English" : "Hebrew"}</span>
                </p>
              )}
              {!chooseLang && <Button onClick={() => setChooseLang(true)}>Change Language</Button>}
            </div>
          )}

          {chooseLang && (
            <div className="mt-4 space-y-4">
              {detectedLanguage !== "unknown" && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Languages className="h-4 w-4 text-blue-600" />
                  <AlertTitle>Language Detection</AlertTitle>
                  <AlertDescription>
                    We detected that this document might be in{" "}
                    <span className="font-medium">{detectedLanguage === "english" ? "English" : "Hebrew"}</span>. Please
                    confirm or select the correct language.
                  </AlertDescription>
                </Alert>
              )}

              <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">Select the correct language:</h3>
              <RadioGroup
                value={selectedLanguage}
                onValueChange={(value) => onLanguageChange(value as "english" | "hebrew")}
                className="flex flex-col items-start space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="english" id="english" />
                  <Label htmlFor="english">English</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hebrew" id="hebrew" />
                  <Label htmlFor="hebrew">Hebrew</Label>
                </div>
              </RadioGroup>

              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                <div className="flex items-start">
                  <HelpCircle className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <p>
                    Selecting the correct language ensures optimal OCR accuracy for student name detection and automated
                    grading.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button onClick={onConfirm}>{isProcessing && processingProgress < 100 ? "Processing..." : "Confirm"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LanguageDetectionDialog
