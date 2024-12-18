import React from 'react';

interface RecordingCardProps {
    language: string;
    duration: string;
    words: number;
    transcription: string;
}

const RecordingCard: React.FC<RecordingCardProps> = ({ language, duration, words, transcription }) => {
    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-md overflow-hidden">
            <div className="p-4">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Recording Details</h2>
                </div>
                <div className="mb-2">
                    <span className="font-bold">Language:</span> {language}
                </div>
                <div className="mb-2">
                    <span className="font-bold">Duration:</span> {duration}
                </div>
                <div className="mb-2">
                    <span className="font-bold">Words:</span> {words}
                </div>
                <div className="mb-4">
                    <p className="text-gray-700">{transcription}</p>
                </div>
                <div className="flex justify-between">
                    <a href="#" className="text-blue-500 hover:underline">Show more</a>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">Download Transcription</button>
                </div>
            </div>
        </div>
    );
};

export default RecordingCard;
