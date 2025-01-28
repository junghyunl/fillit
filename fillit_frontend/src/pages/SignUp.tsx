import FilTakeOn from '@/assets/images/fil-takeon.png';
import BasicInput from '@/components/common/BasicInput';
import BasicButton from '@/components/common/Button/BasicButton';
import FillitLongLog from '@/assets/icons/fillit-long-logo.svg';

const SignUp = () => {
  return (
    <>
      <header>
        <img src={FillitLongLog} className="pt-4 pl-4" />
      </header>
      <div className="flex flex-col justify-center items-center ">
        <div className="flex flex-col items-center pt-16 relative">
          <div className="flex flex-col items-center relative px-24">
            <img
              src={FilTakeOn}
              alt="fil-takeon-img"
              className="relative z-10"
            />
            <div className="absolute bottom-0 flex flex-col items-center z-20">
              <p className="text-center text-white bg-black px-2">
                Hi! It’s your first time here, huh?
              </p>
            </div>
          </div>
          <p className="text-center  text-white bg-black px-2 ">
            What’s your name? 😎
          </p>
        </div>
        <div className="pt-10">
          <BasicInput placeholder="Enter your name" />
          <p className="flex justify-start text-xs">
            영어 최대 8글자, 특수기호 불가
          </p>
          <div className="flex flex-row justify-center pt-10 gap-5">
            <BasicButton text="Back" />
            <BasicButton text="Next" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
