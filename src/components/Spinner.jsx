import ClipLoader from "react-spinners/ClipLoader";

const Spinner = ({
  loading,
  size = 150,
  display = "block",
  margin = "100px auto",
  color = "#4338ca",
}) => {
  const override = {
    display: display,
    margin: margin,
  };
  return (
    <ClipLoader
      color={color}
      loading={loading}
      cssOverride={override}
      size={size}
    />
  );
};

export default Spinner;
