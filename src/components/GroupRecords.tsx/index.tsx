import { IRecordingGroup } from "@/types/RecordingData";
import Link from "next/link";
interface GroupRecordsProps {
    groupedRecordings: IRecordingGroup[];
}
const GroupRecords: React.FC<GroupRecordsProps> = ({ groupedRecordings }) => {
    if (groupedRecordings && groupedRecordings.length > 0) {
        return (
            groupedRecordings.map((recordingGroup, index) => (
                <li key={index}>
                    <h3 className="px-4 py-2 text-2xl  font-semibold text-gray-900 dark:text-white">
                        {recordingGroup.updatedAt}
                    </h3>
                    <ul className="space-y-2 pl-4">
                        {recordingGroup.recordings.map((recording, idx) => (
                            <li
                                key={idx}
                                className="text-gray-700 dark:text-gray-400"
                            >
                                <Link href={`/dashboard/${recording.uuid}`} passHref>
                                    <span className="text-2xl truncate block hover:text-blue-500 dark:hover:text-blue-300 transition duration-300 ease-in-out"> {recording.content}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </li>)))
    }
    else {
        return (
            <li>
                <h3 className="px-4 py-2 text-2xl  font-semibold text-gray-900 dark:text-white">
                    No records yet
                </h3>
            </li>)
    }
}

export default GroupRecords;