//import Link from 'next/link';
import styles from "../styles/Home.module.css";
import PackageJSON from "../package.json";
import { Link, HStack, Text, Icon, Button } from '@chakra-ui/react';
import { FaTwitter} from 'react-icons/fa';
import {useRouter} from 'next/router';

export default function Footer() {

  const router = useRouter();

  const handleNavigation = (target) => {
    router.push(target)
  }

    return (
        <footer className={styles.footer}>
          <div style={{width: "100%", justifyContent: "center",  alignItems: "center"}}>
          <HStack style={{ fontSize: "medium", borderBottom: "1px solid #ffffff", justifyContent: "flex-end",  alignItems: "center"}}>
            <HStack>
            <Button 
              onClick={() => handleNavigation('/docs')}
              bg="transparent"
              color="gray.100"
              padding={0}
              _hover={"transparent"}
            >
              What is Flippando
            </Button>
            <Text> | </Text>
            <Button 
              onClick={() => handleNavigation('/airdrop')}
              bg="transparent"
              color="gray.100"
              padding={0}
              _hover={"transparent"}
            >
              Airdrop
            </Button>
            <Text> | </Text>
            <Button 
              onClick={() => handleNavigation('/roadmap')}
              bg="transparent"
              color="gray.100"
              padding={0}
              _hover={"transparent"}
            >
              Roadmap
            </Button>
            </HStack>
            <Text> | </Text>
            <Text fontStyle={"medium"}>Community: </Text>
            <a href={'https://twitter.com/Flippand0'} target="_blank" rel="noopener noreferrer">
              <Icon as={FaTwitter} w={5} h={5} alignSelf="right" color={'#eeeeee'}/> 
            </a>
          </HStack>
          
          <div>Flippando Gno - version {PackageJSON.version}</div>
            <div>made with &#x2764;&#xFE0F; by <Link href="https://github.com/irreverentsimplicity">@irreverentsimplicity</Link></div>
            <div style={{ display: 'flex', alignItems: 'center'}}>powered by <Link href="https://gno.land">
              <div className="logo-img">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 238">
    <path d="M136.02,160.26c-1.77-6.5-5.55-12.22-10.68-16.59-1.98-1.69-4.14-3.29-6.5-4.78-2-1.27-4.52.6-3.94,2.9l1.42,5.62c1.8,7.14-5.86,12.93-12.24,9.26l-17.15-9.86c-11.27-6.48-25.13-6.48-36.4,0l-17.15,9.86c-6.38,3.67-14.04-2.13-12.24-9.26l1.46-5.78c.58-2.29-1.93-4.16-3.93-2.9-2.62,1.64-5,3.42-7.16,5.29-5.05,4.38-8.56,10.26-10.2,16.74l-.06.24c-4.17,16.56,2.31,33.97,16.29,43.78l43.3,30.37c4.74,3.32,11.05,3.32,15.79,0l43.3-30.37c14.19-9.95,20.65-27.74,16.09-44.51Z" className="logo-beard"></path>
    <path d="M134.22,123.74c-3.78-31.58-19.27-63.22-34.25-87.46l22.26-22.26c5.04-5.04,1.47-13.66-5.66-13.66h-47.94c-3.7,0-7.41,1.63-9.91,4.88C41.84,27.21,8.79,75.55,3.02,123.74c-.52,4.39,4.63,7.08,7.93,4.14,11.52-10.26,29.49-17.6,57.67-17.6s46.14,7.35,57.67,17.6c3.3,2.94,8.45.24,7.93-4.14Z" className="logo-hat"></path>
    <g className="logo-wording">
      <path d="M190.79,202.39l13.67-21.82c9.35,10.07,21.82,14.14,36.2,14.14s32.13-6.23,32.13-29.73v-11.27c-9.11,11.51-21.58,17.98-35.96,17.98-28.77,0-51.06-20.14-51.06-58.74s21.82-58.98,51.06-58.98c13.91,0,26.61,5.75,35.96,17.74v-14.86h30.45v108.12c0,43.87-34.04,54.66-62.57,54.66-19.66,0-35.24-4.55-49.87-17.26ZM272.78,131.66v-37.64c-5.28-7.43-16.3-12.95-26.13-12.95-17.5,0-29.49,11.99-29.49,31.89s11.99,31.89,29.49,31.89c9.83,0,20.86-5.75,26.13-13.19Z"></path>
      <path d="M397.33,172.66v-70c0-16.06-8.39-21.58-21.34-21.58-11.99,0-21.1,6.71-26.37,13.43v78.16h-30.45V56.86h30.45v14.86c7.43-8.63,21.82-17.74,40.52-17.74,25.65,0,37.88,14.38,37.88,36.92v81.75h-30.69Z"></path>
      <path d="M438.76,114.64c0-32.84,23.01-60.65,61.13-60.65s61.37,27.81,61.37,60.65-23.01,60.89-61.37,60.89-61.13-28.05-61.13-60.89ZM529.62,114.64c0-17.98-10.55-33.56-29.73-33.56s-29.49,15.58-29.49,33.56,10.55,33.8,29.49,33.8,29.73-15.58,29.73-33.8Z"></path>
      <path d="M565.38,161.87c0-7.19,5.99-13.19,13.19-13.19s13.19,5.99,13.19,13.19-5.99,13.19-13.19,13.19-13.19-5.99-13.19-13.19Z"></path>
      <path d="M605.35,148.44V12.75h17.98v131.86c0,8.63,3.84,14.86,11.75,14.86,5.03,0,9.83-2.4,11.99-5.03l5.51,13.67c-4.79,4.31-11.03,7.43-21.58,7.43-17.02,0-25.65-9.83-25.65-27.09Z"></path>
      <path d="M745.61,172.66v-17.26c-8.63,11.75-22.77,20.14-39.08,20.14-30.21,0-51.54-23.01-51.54-60.65s21.34-60.89,51.54-60.89c15.58,0,29.73,7.67,39.08,20.38v-17.5h17.98v115.79h-17.98ZM745.61,141.01v-52.26c-6.23-10.07-20.38-18.7-34.52-18.7-23.49,0-37.4,19.18-37.4,44.83s13.91,44.59,37.4,44.59c14.14,0,28.29-8.39,34.52-18.46Z"></path>
      <path d="M860.96,172.66v-75.76c0-20.62-10.55-26.85-26.13-26.85-14.14,0-27.33,8.63-34.28,17.98v84.63h-17.98V56.86h17.98v16.78c8.15-9.83,23.97-19.66,41.47-19.66,23.97,0,36.68,12.23,36.68,37.4v81.27h-17.74Z"></path>
      <path d="M982.02,172.66v-17.26c-8.63,11.75-22.77,20.14-39.08,20.14-30.21,0-51.54-23.01-51.54-60.65s21.34-60.89,51.54-60.89c15.58,0,29.73,7.67,39.08,20.38V12.75h17.98v159.91h-17.98ZM982.02,141.01v-52.26c-6.23-10.07-20.38-18.7-34.52-18.7-23.49,0-37.4,19.18-37.4,44.83s13.91,44.59,37.4,44.59c14.14,0,28.29-8.39,34.52-18.46Z"></path>
    </g>
                </svg>
              </div>
              </Link>
            </div>
          </div>
          
        </footer>
    );
}
