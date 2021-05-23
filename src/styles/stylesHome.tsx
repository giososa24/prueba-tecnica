import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useStylesHome = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
            marginTop: -8
        },
    }),
);