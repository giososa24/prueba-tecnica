import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useStylesNabvar = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        title: {
            flexGrow: 1,
        },
        subtitle: {
            textDecoration: 'none',
            color: '#FFFFFF'
        }
    }),
);