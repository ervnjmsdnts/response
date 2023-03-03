import { IconButton } from "@mui/material";
import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";
interface CopyToClipBoardComponentProps {
  text: string;
}

const CopyToClipBoardComponent: React.FunctionComponent<
  CopyToClipBoardComponentProps
> = (props) => {
  const { text } = props;
  const [copy, setCopy] = useState({
    value: text,
    copied: false,
  });

  return (
    <>
      <CopyToClipboard
        text={copy.value}
        onCopy={() => setCopy({ ...copy, copied: true })}
      >
        <IconButton aria-label="delete" size="large">
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </CopyToClipboard>
    </>
  );
};

export default CopyToClipBoardComponent;
