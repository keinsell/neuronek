module Main (main) where

import Lib
import Options.Applicative

data CommandLineApplication = CommandLineApplication String

-- | Create new @Ingestion@.
data CreateIngestion = CreateIngestion {
  compound :: String,
  dosage :: String
}

-- TODO: Is there generic version of defining cli argument parsing?
-- I would rather have clap_derive-like generic/macro rather than
-- writing parser to manually construct datatype.
createIngestionCommand :: Parser CreateIngestion
createIngestionCommand = CreateIngestion
  <$> strOption (
    long "compound"
    <> short 'c'
    <> metavar "COMPOUND"
    <> help "Compund to be ingested.")
  <*> strOption (
    long "dosage"
    <> short 'd'
    <> metavar "DOSAGE"
    <> help "Amount of COMPOUND being ingested.")

main :: IO ()
main = printIngestion =<< execParser opts
    where opts = info (createIngestionCommand <**> helper) (
            fullDesc
            <> progDesc ""
            <> header "")

printIngestion :: CreateIngestion -> IO ()
printIngestion (CreateIngestion compound dosage) = putStrLn $ "Ingestion: " ++ compound ++ " " ++ dosage
