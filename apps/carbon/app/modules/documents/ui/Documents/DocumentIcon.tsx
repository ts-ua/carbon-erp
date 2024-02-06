import {
  BsFileEarmarkFill,
  BsFileEarmarkPlayFill,
  BsFileExcelFill,
  BsFileImageFill,
  BsFilePdfFill,
  BsFilePptFill,
  BsFileTextFill,
  BsFileWordFill,
  BsFileZipFill,
} from "react-icons/bs";

type DocumentIconProps = {
  fileName: string;
};

const DocumentIcon = ({ fileName }: DocumentIconProps) => {
  const fileExtension = [...fileName.split(".")].pop();

  switch (fileExtension) {
    case "doc":
    case "docx":
      return <BsFileWordFill className="w-6 h-6 color-blue-500" />;
    case "xls":
    case "xlsx":
      return <BsFileExcelFill className="w-6 h-6 text-green-700" />;
    case "ppt":
    case "pptx":
      return <BsFilePptFill className="w-6 h-6 text-orange-400" />;
    case "pdf":
      return <BsFilePdfFill className="w-6 h-6 text-red-600" />;
    case "zip":
    case "rar":
      return <BsFileZipFill className="w-6 h-6" />;
    case "txt":
      return <BsFileTextFill className="w-6 h-6" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "avif":
    case "webp":
      return <BsFileImageFill className="w-6 h-6 text-yellow-400" />;
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
    case "flv":
    case "mkv":
      return <BsFileEarmarkPlayFill className="w-6 h-6 text-purple-500" />;
    case "mp3":
    case "wav":
    case "wma":
    case "aac":
    case "ogg":
    case "m4a":
      return <BsFileEarmarkPlayFill className="w-6 h-6 text-cyan-400" />;
    default:
      return <BsFileEarmarkFill className="w-6 h-6" />;
  }
};

export default DocumentIcon;
