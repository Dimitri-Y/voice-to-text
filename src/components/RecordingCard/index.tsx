import { IRecording } from '@/types/RecordingData';
import { RotatingLinesSpinnerForChat } from '@/ui/loaderSpinners';
import React, { useState } from 'react';

interface RecordingCardProps {
    isLoading: boolean;
    error?: string | null;
    recording: IRecording;
}

const RecordingCard: React.FC<RecordingCardProps> = ({ isLoading, error, recording }) => {
    const [showMore, setShowMore] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShowMore = () => setShowMore(!showMore);

    const handleCopyText = () => {
        navigator.clipboard.writeText(recording?.content || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="max-w-md mx-auto bg-white shadow-md rounded-md overflow-hidden py-4">
                <div className="flex justify-center items-center">
                    < RotatingLinesSpinnerForChat color={"rgb(17,24,39)"}></RotatingLinesSpinnerForChat>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto bg-white shadow-md rounded-md overflow-hidden py-4">
                <div className="text-red-500">Error uploading record</div>
            </div>
        );
    }

    return (
        <div className="mx-auto bg-white shadow-md rounded-md overflow-hidden py-4">
            {recording ? (
                <div className="p-4">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold">Recording Details</h2>
                    </div>
                    <div className="mb-2">
                        <span className="font-bold">Language:</span> {recording.language}
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-700 text-base">
                            {showMore ? recording.content : recording.content.slice(0, 100) + '...'}
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <a
                            href="#"
                            className="text-blue-500 hover:underline"
                            onClick={handleShowMore}
                        >
                            {showMore ? 'Show less' : 'Show more'}
                        </a>
                        <button
                            onClick={handleCopyText}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
                        >
                            Download Transcription
                        </button>
                    </div>
                    {copied && <span className="text-green-500 mt-2">Copied!</span>}
                </div>
            ) : (
                <div className="flex justify-center items-center">No record</div>
            )}
        </div>
    );
};

export default RecordingCard;
