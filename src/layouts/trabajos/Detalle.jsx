import Wrapper from "../Wrapper";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import DataService from "../../services/DataService";
import ProfileInfoCard from "../../examples/Cards/InfoCards/ProfileInfoCard";

const Detalle = () => {
  const { id } = useParams()
  const [job, setJob] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      // const dataJob = await DataService.fetchJobData(1)
      const dataJob = {
        paperType: "Sin Papel",
        paperSize: "A4",
        dobleFaz: true,
        copiesQty: 90
      }

      setJob(dataJob)
    }

    fetchUserData();
  }, [])

  return(
    <Wrapper title={"Detalle del trabajo"}>
      <ProfileInfoCard
        info={{
          "Tipo de papel": job?.paperType,
          "Tamaño de papel": job?.paperSize,
          "Doble Faz?": job?.dobleFaz ? "Si" : "No",
          "Cantidad de Copias": job?.copiesQty,
        }}
        shadow={true}
      />
    </Wrapper>
  )
}

export default Detalle;
