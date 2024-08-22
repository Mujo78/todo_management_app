import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GetMyInfoFn, MyInfoType } from "../../../features/user/api";
import { AxiosError } from "axios";
import { formatErrorMessage } from "../../../utils/user/userUtils";
import { BarChart, BarSeriesType, Gauge } from "@mui/x-charts";
import DeleteProfileModal from "../../../components/User/DeleteProfileModal/DeleteProfileModal";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

const Profile = () => {
  const { t } = useTranslation();
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

  const assignmentArray = useMemo(() => {
    if (!data) return [];

    return Object.entries(data.assignmentCount).map(([key, value]) => ({
      data: [value],
      label: t(`profileOverview.tasksCount.${key}`),
    }));
  }, [data, t]);

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
                  <Typography variant="body1">
                    {t("profileOverview.name")}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Typography
                    textAlign={{ xs: "start", sm: "end" }}
                    color="dark.light"
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
                    color="dark.light"
                    variant="body1"
                  >
                    {data.user.email}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} container>
                <Grid item xs={0} sm={3} display={{ xs: "none", sm: "block" }}>
                  <Typography variant="body1">
                    {t("profileOverview.joined")}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Typography
                    textAlign={{ xs: "start", sm: "end" }}
                    color="dark.light"
                    variant="body1"
                  >
                    {format(new Date(data.user.createdAt), "dd/MM/yyyy")}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} container>
                <Button
                  sx={{ ml: "auto" }}
                  color="error"
                  aria-label="deleteModalProfileBtn"
                  onClick={handleDeleteAccount}
                >
                  {t("profileOverview.deleteAccountBtn")}
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
                xAxis={[
                  {
                    scaleType: "band",
                    data: [`${t("profileOverview.tasks")}`],
                  },
                ]}
                series={assignmentArray as BarSeriesType[]}
                height={300}
              />

              <Stack gap={2}>
                <Gauge
                  role="meter"
                  aria-labelledby="average_level"
                  title="Average"
                  width={200}
                  height={200}
                  value={data.average}
                />
                <Typography
                  id="average_level"
                  textAlign="center"
                  variant="body1"
                >
                  {t("profileOverview.average")}
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
