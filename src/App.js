import './App.css';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useWeb3React } from '@web3-react/core';
import { Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
const contractAbi = "./abi.json"
const contractAddress = "0xF75fd9c3004fFE6D4F8B2BfF2A250E20b8958D15"


function App() {

  const [formData, setFormData] = useState({
    nft__name: "",
    nft__Description: "",
    Imguri:""
  });

  const [show, setShow] = useState(false);
  const injected = new InjectedConnector({
    supportedChainIds: [1, 80001]
  });

  const { activate, deactivate, account, active } = useWeb3React();

  const handleConnect = async () => {
    if (window.ethereum) {
      debugger
      await activate(injected);
    }
    else {
      alert("Install Metamask!");
    }
  }

  const handleClose = () => {
    setShow(false);
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData({ ...formData, [name]: value });

  };

  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Create a FormData object
    const formData = new FormData();
    formData.append('file', file);

    // Upload the file to Pinata
    try {
      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'pinata_api_key': '0e170d513699907cbf29',
          'pinata_secret_api_key': '131692fe2b3d3be7711d03f3258cc73e5a7b855b58bdfb191237fb6e2e692ade',
        },
      });
      const imgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      formData.Imguri = imgHash;

       // Call the mintNFT function with the obtained IPFS hash
       await yourContractInstance.methods.mintNFT(response.data.IpfsHash).send({ from: 'YOUR_WALLET_ADDRESS' });
      
      console.log('IPFS Hash:', response.data.IpfsHash);
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
    }
  };


  
  return (
    <div className="App">
      <div>
        <h2>Welcome to marketplace</h2>
        {
          active ? (<p>{account}</p>) : (
            <button onClick={handleConnect}>
              Connect Wallet
            </button>)
        }

        <div>
          <button onClick={() => { setShow(true) }}>Create</button>
        </div>

        <div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Create NFT</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form className='form'>
                <Form.Group>
                  <Form.Control
                    type="file"
                    placeholder='file'
                    onChange={handleFileUpload} 
                    // value={fileImg.image}
                  />

                     {/* <button type="submit" onSubmit={sendFileToIPFS}>Save</button> */}
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    name="nft__name"
                    type='text'
                    placeholder='NFT Name'
                    value={formData?.nft__name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    type='text'
                    placeholder='NFT Price'
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    name="nft__Description"
                    type='text'
                    placeholder='NFT Description'
                    value={formData?.nft__Description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>

              {/* <button type="submit" onClick={handleSubmit}>Submit</button> */}
              <button type="submit" onClick={handleFormSubmit}>Submit</button>

            </Modal.Body>
          </Modal>
        </div>
      </div>

      <div className='nftSection'>


      </div>
    </div>
  );
}

export default App;
