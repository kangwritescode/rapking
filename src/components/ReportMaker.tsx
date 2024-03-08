import { Button, FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material';
import { Rap, ReportType, ReportedEntity, ThreadComment, User } from '@prisma/client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';

interface ReportMakerProps {
  cancelButtonHandler: () => void;
  onSuccessfulReport: () => void;
  reportedEntity: ReportedEntity;
  rapData?: (Rap & { user?: Partial<User> }) | null;
  commentData?: ThreadComment | null;
  forumThreadId?: string;
}

function ReportMaker({
  cancelButtonHandler,
  onSuccessfulReport,
  reportedEntity,
  rapData,
  commentData,
  forumThreadId
}: ReportMakerProps) {
  const [value, setValue] = useState<ReportType>(ReportType.HARASSMENT);

  const { mutate: postReport } = api.reports.postReport.useMutation({
    onSuccess: () => {
      onSuccessfulReport();
      toast.success('Reported successfully');
    }
  });

  const handleReport = async () => {
    const reportedId = reportedEntity === ReportedEntity.RAP ? rapData?.userId : undefined;
    postReport({
      type: value,
      reportedEntity,
      rapId: reportedEntity === ReportedEntity.RAP ? rapData?.id : undefined,
      reportedId,
      threadCommentId: commentData?.id || undefined,
      forumThreadId: forumThreadId || undefined
    });
  };

  return (
    <>
      <RadioGroup
        value={value}
        onChange={event => {
          setValue(event.target.value as ReportType);
        }}
        name='radio-buttons-group'
      >
        <FormControlLabel value={ReportType.HARASSMENT} control={<Radio />} label={'Harassment'} />
        <FormControlLabel value={ReportType.SPAM} control={<Radio />} label={'Spam'} />
        <FormControlLabel
          value={ReportType.RULES_VIOLATION}
          control={<Radio />}
          label={'Rules Violation'}
        />
        <FormControlLabel value={ReportType.OTHER} control={<Radio />} label={'Other'} />
      </RadioGroup>

      <Stack direction='row' spacing={2} width='100%' justifyContent='flex-end'>
        <Button
          onClick={cancelButtonHandler}
          variant='text'
          sx={{
            color: theme => theme.palette.text.secondary
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleReport} variant='contained' color='error'>
          Report
        </Button>
      </Stack>
    </>
  );
}

export default ReportMaker;
