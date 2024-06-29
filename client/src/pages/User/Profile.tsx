import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GetMyInfoFn, MyInfoType } from "../../features/user/api";
import { AxiosError } from "axios";
import { formatErrorMessage } from "../../components/utils/userUtils";
import { BarChart, BarSeriesType, Gauge } from "@mui/x-charts";

const Profile = () => {
  const { data, isLoading, isError, error, isSuccess } = useQuery<
    MyInfoType,
    Error | AxiosError<unknown, unknown>
  >({
    queryKey: ["myInfo"],
    queryFn: GetMyInfoFn,
    placeholderData: keepPreviousData,
    retry: 1,
  });

  const handleDeleteAccount = () => {
    console.log("object");
  };

  const assignmentArray =
    data &&
    Object.entries(data?.assignmentCount).map(([key, value]) => ({
      data: [value],
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));

  return (
    <Stack px={1}>
      {isLoading ? (
        <Stack display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      ) : isSuccess ? (
        <Stack gap={3}>
          <Stack gap={3} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <Typography variant="body1">Name/Username:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography textAlign="end" color="gray" variant="body1">
                  {data.user.name}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <Typography variant="body1">Email:</Typography>
              </Grid>
              <Grid item textAlign="end" color="gray" xs={9}>
                <Typography variant="body1">{data.user.email}</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <Typography variant="body1">Joined:</Typography>
              </Grid>
              <Grid item textAlign="end" color="gray" xs={9}>
                <Typography variant="body1">
                  {new Date(data.user.createdAt).toDateString()}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Button
                sx={{ ml: "auto" }}
                color="error"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </Grid>
          </Stack>

          <Stack flexDirection="row" alignItems="center" gap={4}>
            <BarChart
              loading={isLoading}
              series={assignmentArray as BarSeriesType[]}
              width={500}
              height={300}
            />

            <Gauge width={200} height={200} value={data.average} />
          </Stack>
        </Stack>
      ) : (
        isError && <Alert severity="error">{formatErrorMessage(error)}</Alert>
      )}
    </Stack>
  );
};

export default Profile;
