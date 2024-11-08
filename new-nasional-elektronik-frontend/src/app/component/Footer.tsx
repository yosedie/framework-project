import * as React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid2";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { useRouter } from "next/navigation";
import Image from "next/image";
import logoWhite from "../public/logo_white.png";
import logoTwitter from "../public/logo_twitter.svg";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  boxShadow: "none",
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

function Footer() {
  const router = useRouter();
  return (
    <AppBar position="static" sx={{ marginTop: "5%", padding: "2.5%" }}>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid size={4}>
            <Item sx={{ textAlign: "left" }}>
              <Typography variant="body1" color="white">
                <b>Connect with us</b>
              </Typography>
              {/* <Image
                draggable={false}
                src={logoTwitter}
                alt="Example"
                width={25}
                height={25}
                style={{
                  cursor: "pointer",
                }}
              /> */}
            </Item>
          </Grid>
          <Grid size={4}>
            <Item sx={{ textAlign: "left" }}>
              <Typography variant="body1" color="white" whiteSpace={"pre-line"}>
                <b>Explore our page</b> {"\n"}
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push("/products")}
                >
                  Products
                </span>{" "}
                {"\n"}
                <span style={{ cursor: "pointer" }}>Events</span> {"\n"}
                <span style={{ cursor: "pointer" }}>About us</span>
              </Typography>
            </Item>
          </Grid>
          <Grid size={4}>
            <Item sx={{ textAlign: "left" }}>
              <Image
                draggable={false}
                src={logoWhite}
                alt="Example"
                width={75}
                height={50}
              />
              <Typography variant="body1" color="white">
                <b>@ New Nasional Elektronik 2024</b>
              </Typography>
            </Item>
          </Grid>
        </Grid>
      </Container>
    </AppBar>
  );
}
export default Footer;
