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
import DeleteProfileModal from "../../components/User/DeleteProfileModal";
import { useState } from "react";

const Profile = () => {
  const [show, setShow] = useState<boolean>(false);
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
    setShow(true);
  };

  const assignmentArray =
    data &&
    Object.entries(data?.assignmentCount).map(([key, value]) => ({
      data: [value],
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));

  return (
    <>
      <Stack px={1} pb={{ xs: 6, sm: 0 }}>
        {isLoading ? (
          <Stack display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Stack>
        ) : isSuccess ? (
          <Stack gap={3}>
            <Stack
              gap={{ xs: 1, sm: 3 }}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} container>
                <Grid item display={{ xs: "none", sm: "block" }} xs={0} sm={3}>
                  <Typography variant="body1">Name/Username:</Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Typography
                    textAlign={{ xs: "start", sm: "end" }}
                    color="gray"
                    variant="body1"
                  >
                    {data.user.name}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} container>
                <Grid item display={{ xs: "none", sm: "block" }} xs={0} sm={3}>
                  <Typography variant="body1">Email:</Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Typography
                    textAlign={{ xs: "start", sm: "end" }}
                    color="gray"
                    variant="body1"
                  >
                    {data.user.email}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} container>
                <Grid item xs={0} sm={3} display={{ xs: "none", sm: "block" }}>
                  <Typography variant="body1">Joined:</Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Typography
                    textAlign={{ xs: "start", sm: "end" }}
                    color="gray"
                    variant="body1"
                  >
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

            <Stack
              flexDirection={{ xs: "column", md: "row" }}
              alignItems="center"
              gap={{ xs: 1, sm: 4 }}
            >
              <BarChart
                loading={isLoading}
                xAxis={[{ scaleType: "band", data: ["Tasks"] }]}
                series={assignmentArray as BarSeriesType[]}
                height={300}
              />

              <Stack gap={2}>
                <Gauge
                  title="Average"
                  width={200}
                  height={200}
                  value={data.average}
                />
                <Typography textAlign="center" variant="body1">
                  Average
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        ) : (
          isError && <Alert severity="error">{formatErrorMessage(error)}</Alert>
        )}
      </Stack>
      <DeleteProfileModal
        show={show}
        setShow={setShow}
        total={data?.assignmentCount.total}
      />
    </>
  );
};

export default Profile;
